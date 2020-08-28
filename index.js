#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const create = require('./lib/create')
const templates = require('./lib/templates')
const download = require('./lib/download')
const overwrite = require('./lib/overwrite')
const merge = require('./lib/merge')

program
	.version('1.0.0')

program
	.command('create <template> <project>')
	.description('Generate local project template')
	.action(async (templateName, projectName) =>{
		try {
			const res = await create(projectName)
			if (!res) return
			const { downloadUrl, name } = templates[templateName]
			const sourceDir = path.resolve(name)
			const targetDir = path.resolve(projectName || '.')
			download(downloadUrl, name, projectName)
			switch(res.action) {
				case 'overwrite':
					overwrite(sourceDir, targetDir, projectName)
					break;
				case 'merge':
					merge(sourceDir, targetDir, name, projectName)
					break;
				default:
					break;
			}
		} catch (err) {
			console.log(`${chalk.cyan(err)}`)
		}
	})

program
	.command('list')
	.description('All available templates here')
	.action(() => {
		for(let key in templates) {
			ora(`${chalk.green(key)} ${chalk.cyan(templates[key].description)}`).succeed()
		}
	})

program
	.parse(process.argv)

