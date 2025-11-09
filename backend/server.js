require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Используем ключи из .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
    .then(({ data, error }) => done(error, data));
});

// GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    supabase
      .from('users')
      .select('*')
      .eq('github_id', profile.id)
      .single()
      .then(({ data, error }) => {
        if (data) return done(null, data);

        const id = nanoid(32);
        supabase
          .from('users')
          .insert([{
            id,
            github_id: profile.id,
            displayname: profile.displayName,
            photo: (profile.photos[0] || {}).value
          }])
          .then(() => {
            supabase
              .from('users')
              .select('*')
              .eq('id', id)
              .single()
              .then(({ data: user2, error: err2 }) => done(err2, user2));
          });
      });
  }
));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => res.redirect('http://localhost:3000'));
app.get('/api/user', (req, res) => res.json(req.user || null));

// --- CRUD supabase endpoints для todos:
app.get('/api/todos', async (req, res) => {
  if (!req.user) return res.json([]);
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.post('/api/todo/create', async (req, res) => {
  if (!req.user) return res.sendStatus(403);
  const id = nanoid(8);
  const { title, description = "" } = req.body;
  const { data, error } = await supabase
    .from('todos')
    .insert([{ id, user_id: req.user.id, title, columnname: 'todo', description }])
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.patch('/api/todo/descredit/:id', async (req, res) => {
  const { title, description } = req.body;
  const { data, error } = await supabase
    .from('todos')
    .update({ title, description })
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.delete('/api/todo/delete/:id', async (req, res) => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.sendStatus(204);
});

app.patch('/api/todo/to/:id', async (req, res) => {
  const { columnName } = req.body;
  const { data, error } = await supabase
    .from('todos')
    .update({ columnname: columnName })
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.sendStatus(200);
});

app.get('/api/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.json({ loggedOut: true });
    });
  });
});

app.listen(5000, () => console.log('Backend listening on port 5000'));
