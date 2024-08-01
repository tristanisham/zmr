import { FC } from "jsr:@hono/hono@^4.5.3/jsx";

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

export const Home: FC = () => {
  return (
    <Layout>
      <head>
        <title>Zig Module Resolver</title>
        <link rel="stylesheet" href="static/style.css" />
      </head>
      <body style={""}>
        <main>
          <h1>
            Zig Module Resolver
          </h1>
          <h2 class={""}>
            Easily fetch modules for the Zig Package manager
          </h2>
          <p style={""}>
            Use ZMR to easily find and download Zig modules using the Zig
            package manager.
          </p>
          <p>
            <code>
            # zig fetch --save https://zmr.onl/github.com/:user/:repo/:version
            </code>
          </p>
          <p>
            If you want a practical example of how to fetch a real life module, try using ZMR to fetch my dotenv module!
          </p>
          <p>
            <code>
              zig fetch --save https://zmr.onl/github.com/tristanisham/dotenv/v0.0.2
            </code>
          </p>
        </main>
      </body>
    </Layout>
  );
};
