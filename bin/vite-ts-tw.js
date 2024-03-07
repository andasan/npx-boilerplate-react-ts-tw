#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");

const enteredDirName = process.argv[2];
if (!enteredDirName) {
	console.log(chalk.red("Please enter the directory name"));
	process.exit(-1);
}

/**
 * Commands to run
 *
 * @type {Object}
 * @property {string} INSTALL_VITE_TS - Create a new Vite project with React and TypeScript
 * @property {string} INSTALL_TAILWIND - Install TailwindCSS, PostCSS and Autoprefixer
 * @property {string} INITIALIZE_TAILWIND - Initialize TailwindCSS
 * @property {string} INITIALIZE_GIT - Initialize Git
 * @property {string} CHANGE_BRANCH - Change the branch to main
 * @property {string} INSTALL_DEPENDENCIES - Install the dependencies
 *
 */
const RUN_COMMAND = {
	INSTALL_VITE_TS: `npm init vite@latest ${enteredDirName} -- --template react-ts`,
	INSTALL_TAILWIND: `cd ${enteredDirName} && npm install -D tailwindcss postcss autoprefixer`,
	INITIALIZE_TAILWIND: `cd ${enteredDirName} && npx tailwindcss init -p --ts`,
	INITIALIZE_GIT: `cd ${enteredDirName} && git init`,
	CHANGE_BRANCH: `cd ${enteredDirName} && git branch -M main`,
	INSTALL_DEPENDENCIES: `cd ${enteredDirName} && npm install`,
};

/**
 * Readline module provides an interface for reading data from a Readable stream
 * (such as process.stdin) one line at a time.
 *
 * @type {readline}
 *
 */
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Execute the command synchronously
 *
 * @param {string} command - cli command
 * @returns boolean
 */
function execCommand(command) {
	try {
		execSync(`${command}`, { stdio: "inherit" });
		return true;
	} catch (error) {
		console.error(`Failed to execute command ${command}`, error);
		return false;
	}
}

/**
 * Execute the TailwindCSS initialization command
 * and update the tailwind.config.ts file
 *
 * @returns void
 */
function executeTailwindInitialization(callback) {
	if (!execCommand(RUN_COMMAND.INITIALIZE_TAILWIND)) {
		console.error("Failed to initialize Tailwind CSS. Please do it manually.");
		process.exit(-1);
	} else {
		console.log(chalk.green("✅ Initialized TailwindCSS"));
		updateTailwindConfig(callback);
	}
}

/**
 * Update the tailwind.config.js and index.css files
 *
 * @param {Function} callback - Callback function to execute after the update
 * @returns void
 */
function updateTailwindConfig(callback) {
	const configFilePath = `${enteredDirName}/tailwind.config.ts`;

	try {
		const data = fs.readFileSync(configFilePath, "utf8");

		// Replace the content property
		const updatedContent = data.replace(
			/content: \[\]/,
			`content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`,
		);

		fs.writeFileSync(configFilePath, updatedContent, "utf8");

		console.log(chalk.green("✅ Updated tailwind.config.ts"));
		updateIndexCss(callback);
	} catch (err) {
		console.error(`Error updating tailwind.config.ts: ${err}`);
		process.exit(-1);
	}
}

/**
 * Update the index.css file
 *
 * @param {Function} callback - Callback function to execute after the update
 * @returns void
 */
function updateIndexCss(callback) {
	const indexCssFilePath = `${enteredDirName}/src/index.css`;

	try {
		const data = fs.readFileSync(indexCssFilePath, "utf8");

		// Add the tailwind directives
		const updatedContent = `@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n\n${data}`;

		fs.writeFileSync(indexCssFilePath, updatedContent, "utf8");

		console.log(chalk.green("✅ Updated index.css"));

		if (typeof callback === "function") {
			callback();
		}
	} catch (err) {
		console.error(`Error updating index.css: ${err}`);
		process.exit(-1);
	}
}

/**
 * Prompt the user to initialize Git in the project
 *
 * @returns void
 */
function promptUser() {
	console.log(); // Add a newline here
	rl.question(
		"Do you want to initialize Git in the project? (Y̲/n): ",
		(answer) => {
			const shouldInitializeGit =
				answer.trim().toLowerCase() === "y" || answer.trim() === "";
			rl.close();

			if (shouldInitializeGit) {
				executeGitInitialization();
			} else {
				console.log(chalk.yellow("Skipped Git initialization."));
				continueSetup();
			}
		},
	);
}

/**
 * Execute the Git initialization command
 *
 * @returns void
 *
 */
function executeGitInitialization() {
	if (!execCommand(RUN_COMMAND.INITIALIZE_GIT)) {
		console.error("Failed to initialize Git. Please do it manually.");
		process.exit(-1);
	} else {
		console.log(chalk.green("✅ Initialized Git"));
	}

	if (!execCommand(RUN_COMMAND.CHANGE_BRANCH)) {
		console.error("Failed to change the branch. Please do it manually.");
	} else {
		console.log(chalk.green("✅ Changed the branch"));
		continueSetup();
	}
}

/**
 * Continue with the remaining setup steps
 *
 * @returns void
 */
function continueSetup() {
	// Continue with the remaining setup steps
	if (!execCommand(RUN_COMMAND.INSTALL_DEPENDENCIES))
		console.error("Failed to install dependencies. Please do it manually.");
	else console.log(chalk.green("✅ Installed the dependencies"));

	console.log("\n\n");
	console.log(
		chalk.blue(
			"           (`-')      (`-').->           <-.(`-') (`-')  _    (`-')  (`-')  _ \n" +
			"     .->   ( OO).->   ( OO)_       .->    __( OO) (OO ).-/ <-.(OO )  ( OO).-/ \n" +
			"(`-')----. /    '._  (_)--\\_) ,--.(,--.  '-'. ,--./ ,---.  ,------,)(,------. \n" +
			"( OO).-.  '|'--...__)/    _ / |  | |(`-')|  .'   /| \\ /`\\. |   /`. ' |  .---' \n" +
			"( _) | |  |`--.  .--'\\_..`--. |  | |(OO )|      /)'-'|_.' ||  |_.' |(|  '--.  \n" +
			" \\|  |)|  |   |  |   .-._)   \\|  | | |  \\|  .   '(|  .-.  ||  .   .' |  .--'  \n" +
			"  '  '-'  '   |  |   \\       /\\  '-'(_ .'|  |\\   \\|  | |  ||  |\\  \\  |  `---. \n" +
			"   `-----'    `--'    `-----'  `-----'   `--' '--'`--' `--'`--' '--' `------' \n"
		)
	);

	console.log(
		chalk.green(
			"\n🍻 Successfully created a new React project with Vite and TailwindCSS 🚀\n",
		),
	);
	process.exit(0);
}

// Start the setup process
console.log(
	chalk.yellow(
		"\nCreating a new React TypeScript project with Vite and TailwindCSS 🚀\n",
	),
);

if (!execCommand(RUN_COMMAND.INSTALL_VITE_TS))
	console.error("Failed to create the project. Please do it manually.");
else console.log(chalk.green("✅ React TypeScript project created"));

if (!execCommand(RUN_COMMAND.INSTALL_TAILWIND))
	console.error("Failed to install tailwindcss. Please do it manually.");
else console.log(chalk.green("✅ Installed TailwindCSS"));

// Execute the TailwindCSS initialization command and prompt the user to initialize Git
executeTailwindInitialization(() => promptUser());
