
import {AbstractTask} from 'phusion/src/build/task/AbstractTask';
import {ModuleContainer} from "../module/ModuleContainer";

export class ClassmapTask extends AbstractTask
{
	protected moduleContainer: ModuleContainer;
	protected queueLimit: number = 1;

	public exec()
	{
		let taskConfig = this.getTaskConfig();

		let projectRoot = taskConfig.getByPath('projectRootDirPath');
		let outputFilePath = taskConfig.getByPath('outputFilePath');
		let groups = taskConfig.getByPath('groups');
		let ignoreDirs = taskConfig.getByPath('ignoreDirs');

		let filesScanned = this
			.getModuleContainer()
			.getAutoloadModule()
			.generateClassmap(projectRoot, outputFilePath, groups, ignoreDirs);

		this.logInfo(this.constructor['name'] + ': ' + filesScanned + ' files scanned');
	}

	protected getRequiredTaskConfigPaths(): Object
	{
		return {
			projectRootDirPath: "string",
			outputFilePath: "string",
			groups: "object"
		};
	}

	protected getDefaultTaskConfig(): Object
	{
		let cwd = process.cwd();

		return {
			projectRootDirPath: cwd,
			outputFilePath: cwd + '/cache/classmap.js',
			groups: {
				"component": '^(?!Abstract|abstract.*$)[^\\s]*[Cc]omponent\\.ts$' // All TS classes that end in the word "Component" and do not start with the word "Abstract"
			},
			ignoreDirs: [
				/node_modules/
			]
		};
	}

	protected getModuleContainer(): ModuleContainer
	{
		if (!this.moduleContainer)
		{
			this.moduleContainer = new ModuleContainer();
		}

		return this.moduleContainer;
	}
}