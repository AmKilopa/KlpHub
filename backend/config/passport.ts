import { Strategy as GitHubStrategy } from 'passport-github2';
import { nanoid } from 'nanoid';
import { PassportStatic } from 'passport';
import { SupabaseClient } from '@supabase/supabase-js';

export default function setupPassport(passport: PassportStatic, supabase: SupabaseClient) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: `${process.env.BACKEND_URL}${process.env.CALLBACK_PATH}`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('github_id', profile.id)
            .single();

          if (error && error.code !== 'PGRST116') return done(error);

          if (user) return done(null, user);

          const newUser = {
            id: nanoid(32),
            github_id: profile.id,
            displayname: profile.displayName,
            photo: profile.photos?.[0]?.value || null,
          };

          const { error: insertError } = await supabase.from('users').insert([newUser]);

          if (insertError) return done(insertError);
          done(null, newUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));

  passport.deserializeUser(async (id: string, done) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      done(error, data);
    } catch (err) {
      done(err);
    }
  });
}
