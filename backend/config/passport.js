const GitHubStrategy = require('passport-github2').Strategy;
const nanoid = require('nanoid'); // <-- ИСПРАВЛЕНИЕ ЗДЕСЬ

module.exports = function(passport, supabase) {

  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}${process.env.CALLBACK_PATH}`
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('github_id', profile.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (user) {
          return done(null, user);
        }

        const newUserId = nanoid(32); // Теперь эта строка будет работать
        const newUser = {
          id: newUserId,
          github_id: profile.id,
          displayname: profile.displayName,
          photo: (profile.photos[0] || {}).value
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert([newUser]);

        if (insertError) {
          throw insertError;
        }
        
        return done(null, newUser);

      } catch (err) {
        return done(err, null);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      done(error, data);
    } catch (err) {
      done(err, null);
    }
  });
};