import { Hono } from "hono";
import { Octokit } from "https://esm.sh/octokit@3.1.1?dts";
import { basename } from "@std/path/basename";
import { Home } from "./views/Home.tsx";
import { logger } from 'hono/logger'
import {serveStatic} from 'hono/deno'

const app = new Hono();
app.use('/static/*', serveStatic({ root: './' }))
app.use(logger())

app.get("/", (c) => {
  return c.html(<Home/>);
});

app.get("/github.com/:user/:repo/:version", async (c) => {
  const { user, repo, version } = c.req.param();
  const octokit = new Octokit({
    auth: Deno.env.get("GH_TOKEN"),
  });

  try {
    const resp = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/tags/{tag}",
      {
        owner: user,
        repo: repo,
        tag: version,
        headers: {
          accept: "application/vnd.github+json",
        },
      },
    );

    if (resp.data.tarball_url) {
      try {
        const tarball = resp.data.tarball_url;
        const fileName = basename(tarball);
        const fileStream = await grabFile(tarball);
        return new Response(fileStream, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition":
              `attachment; filename="${repo}-${fileName}.tar.gz"`, // Customize the filename if needed
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          return c.text(err.message);
        }
      }
    }
  } catch (error) {
    if (error.status === 404) {
      return c.text(`Release not found for tag: ${version}`, 404);
    } else {
      return c.text(`Error: ${error.message}`, error.status || 500);
    }
  }
});

Deno.serve(app.fetch);

async function grabFile(url: string | URL): Promise<Uint8Array> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file: ${response.statusText}, ${response.status}`,
    );
  }

  const fileBlob = await response.blob();
  const fileBuffer = await fileBlob.arrayBuffer();
  const fileStream = new Uint8Array(fileBuffer);

  return fileStream;
}
