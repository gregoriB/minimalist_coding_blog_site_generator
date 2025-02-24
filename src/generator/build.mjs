import fs from "fs";
import { colors, directories, templateFile } from "./variables.mjs";
import { copyDir } from "./helpers.mjs";

const { GRAY, RED, CYAN, GREEN, BLUE, ORANGE, MAGENTA, CLEAR } = colors;
const { articlesDir, sourceDir, siteDir, buildDir } = directories;

function checkArticlesDir() {
  if (!fs.existsSync(articlesDir)) {
    throw new Error(
      articlesDir +
        " directory does not exist. There are no articles to build!",
    );
  }

  if (fs.readdirSync(articlesDir).length === 0)
    throw new Error(
      articlesDir + " directory is empty. There are no articles to build!",
    );

  return true;
}

function makeBuildDir() {
  fs.rmSync(buildDir, { force: true, recursive: true });
  fs.mkdirSync(buildDir, { recursive: true });
  console.log(`${GRAY}Creating deployable build${CLEAR}`);
  copyDir(sourceDir + siteDir, buildDir, { minify: true });
  copyDir(articlesDir, buildDir, { minify: true });
  fs.copyFileSync(sourceDir + templateFile, buildDir + "index.html");
}

/**
 * Create deployable build Dir
 */
export default async function createBuild() {
  try {
    console.log(`${CYAN}Building${CLEAR}`, "\n");
    checkArticlesDir();
    makeBuildDir();
    console.log(`${GREEN}Build complete!${CLEAR}`, "\n");
  } catch (error) {
    console.error(`ERROR PROCESSING FILES:`, error);
    console.log(`${ORANGE}!!! STOPPING BUILD !!!${CLEAR}`);
  }
}
