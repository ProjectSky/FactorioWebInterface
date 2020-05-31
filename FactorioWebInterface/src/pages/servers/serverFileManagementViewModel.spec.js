var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { strict } from "assert";
import { ServersPageTestServiceLocator } from "../../testUtils/testServiceLocator";
import { ServersViewModel } from "./serversViewModel";
import { ServersHubService } from "./serversHubService";
import { CollectionChangeType } from "../../ts/utils";
import { FileSelectionService } from "../../services/fileSelectionservice";
import { UploadService } from "../../services/uploadService";
import { PromiseHelper } from "../../utils/promiseHelper";
import { ServerFileManagementService } from "./serverFileManagementService";
const tempFile = {
    Name: 'file.zip',
    Size: 0,
    Directory: 'temp_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const tempFile2 = {
    Name: 'file2.zip',
    Size: 0,
    Directory: 'temp_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const localFile = {
    Name: 'local_file.zip',
    Size: 0,
    Directory: 'local_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const localFile2 = {
    Name: 'local_file2.zip',
    Size: 0,
    Directory: 'local_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const globalFile = {
    Name: 'global_file.zip',
    Size: 0,
    Directory: 'global_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const globalFile2 = {
    Name: 'global_file2.zip',
    Size: 0,
    Directory: 'global_saves',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
describe('ServerFileManagementViewModel', function () {
    describe('upload save command', function () {
        it('can execute when not uploading', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // Arrange.          
                let services = new ServersPageTestServiceLocator();
                let file = {};
                let fileSelectionService = services.get(FileSelectionService);
                fileSelectionService._filesToReturn = [file];
                let actualUploadEvent = undefined;
                let uploadService = services.get(UploadService);
                uploadService.methodCalled.subscribe(event => {
                    if (event.name === 'uploadFormData') {
                        actualUploadEvent = event;
                    }
                });
                let mainViewModel = services.get(ServersViewModel);
                let viewModel = mainViewModel.serverFileManagementViewModel;
                strict.equal(viewModel.uploadSavesCommand.canExecute(), true);
                // Act.
                viewModel.uploadSavesCommand.execute();
                yield PromiseHelper.delay(0);
                // Assert.
                let actaulUrl = actualUploadEvent.args[0];
                strict.equal(actaulUrl, ServerFileManagementService.fileUploadUrl);
                let actualFormData = actualUploadEvent.args[1];
                let files = actualFormData.getAll('files');
                strict.equal(files[0], file);
                strict.equal(viewModel.isUploading.value, true);
            });
        });
        it('can not execute when uploading', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // Arrange.          
                let services = new ServersPageTestServiceLocator();
                let file = {};
                let fileSelectionService = services.get(FileSelectionService);
                fileSelectionService._filesToReturn = [file];
                let mainViewModel = services.get(ServersViewModel);
                let viewModel = mainViewModel.serverFileManagementViewModel;
                strict.equal(viewModel.uploadSavesCommand.canExecute(), true);
                // Execute command to start an upload.
                viewModel.uploadSavesCommand.execute();
                yield PromiseHelper.delay(0);
                strict.equal(viewModel.isUploading.value, true);
                let actualUploadEvent = undefined;
                let uploadService = services.get(UploadService);
                uploadService.methodCalled.subscribe(event => {
                    if (event.name === 'uploadFormData') {
                        actualUploadEvent = event;
                    }
                });
                // Act.
                viewModel.uploadSavesCommand.execute();
                yield PromiseHelper.delay(0);
                // Assert.
                strict.equal(viewModel.uploadSavesCommand.canExecute(), false);
                strict.equal(actualUploadEvent, undefined);
            });
        });
    });
    describe('delete saves command', function () {
        it('can execute when saves are selected.', function () {
            // Arrange.          
            let services = new ServersPageTestServiceLocator();
            let mainViewModel = services.get(ServersViewModel);
            let viewModel = mainViewModel.serverFileManagementViewModel;
            let hubService = services.get(ServersHubService);
            let actualFiles = undefined;
            hubService.methodCalled.subscribe(event => {
                if (event.name === 'deleteFiles') {
                    actualFiles = event.args[0];
                }
            });
            hubService._tempSaveFiles.raise({ Type: CollectionChangeType.Reset, serverId: '1', NewItems: [tempFile] });
            let tempFiles = mainViewModel.tempFileViewModel.files;
            tempFiles.setSingleSelected(tempFiles.getBoxByKey(tempFile.Name));
            strict.equal(viewModel.deleteSavesCommand.canExecute(), true);
            // Act.
            viewModel.deleteSavesCommand.execute();
            // Assert.
            strict.equal(actualFiles[0], `${tempFile.Directory}/${tempFile.Name}`);
        });
        it('can not execute when no saves are selected.', function () {
            // Arrange.          
            let services = new ServersPageTestServiceLocator();
            let mainViewModel = services.get(ServersViewModel);
            let viewModel = mainViewModel.serverFileManagementViewModel;
            let hubService = services.get(ServersHubService);
            let actualFiles = undefined;
            hubService.methodCalled.subscribe(event => {
                if (event.name === 'deleteFiles') {
                    actualFiles = event.args[0];
                }
            });
            hubService._tempSaveFiles.raise({ Type: CollectionChangeType.Reset, serverId: '1', NewItems: [tempFile] });
            // Act.
            viewModel.deleteSavesCommand.execute();
            // Assert.
            strict.equal(viewModel.deleteSavesCommand.canExecute(), false);
            strict.equal(actualFiles, undefined);
        });
        it('canExecuteChanged raised when saves are selected.', function () {
            // Arrange.          
            let services = new ServersPageTestServiceLocator();
            let mainViewModel = services.get(ServersViewModel);
            let viewModel = mainViewModel.serverFileManagementViewModel;
            let hubService = services.get(ServersHubService);
            hubService._tempSaveFiles.raise({ Type: CollectionChangeType.Reset, serverId: '1', NewItems: [tempFile] });
            let raised = false;
            viewModel.deleteSavesCommand.canExecuteChanged.subscribe(() => raised = true);
            let tempFiles = mainViewModel.tempFileViewModel.files;
            // Act.
            tempFiles.setSingleSelected(tempFiles.getBoxByKey(tempFile.Name));
            // Assert.
            strict.equal(raised, true);
        });
        let testCases = [
            {
                name: 'temp',
                expected: [`${tempFile.Directory}/${tempFile.Name}`],
                arrange: (vm) => {
                    let files = vm.tempFileViewModel.files;
                    files.setSingleSelected(files.getBoxByKey(tempFile.Name));
                }
            },
            {
                name: 'temp2',
                expected: [`${tempFile2.Directory}/${tempFile2.Name}`],
                arrange: (vm) => {
                    let files = vm.tempFileViewModel.files;
                    files.setSingleSelected(files.getBoxByKey(tempFile2.Name));
                }
            },
            {
                name: 'local',
                expected: [`${localFile.Directory}/${localFile.Name}`],
                arrange: (vm) => {
                    let files = vm.localFileViewModel.files;
                    files.setSingleSelected(files.getBoxByKey(localFile.Name));
                }
            },
            {
                name: 'global',
                expected: [`${globalFile.Directory}/${globalFile.Name}`],
                arrange: (vm) => {
                    let files = vm.globalFileViewModel.files;
                    files.setSingleSelected(files.getBoxByKey(globalFile.Name));
                }
            },
            {
                name: 'all',
                expected: [
                    `${tempFile.Directory}/${tempFile.Name}`,
                    `${tempFile2.Directory}/${tempFile2.Name}`,
                    `${localFile.Directory}/${localFile.Name}`,
                    `${localFile.Directory}/${localFile2.Name}`,
                    `${globalFile.Directory}/${globalFile.Name}`,
                    `${globalFile2.Directory}/${globalFile2.Name}`
                ],
                arrange: (vm) => {
                    vm.tempFileViewModel.files.selectAll();
                    vm.localFileViewModel.files.selectAll();
                    vm.globalFileViewModel.files.selectAll();
                }
            },
        ];
        for (let testCase of testCases) {
            it(`deletes the selected saves ${testCase.name}.`, function () {
                // Arrange.          
                let services = new ServersPageTestServiceLocator();
                let mainViewModel = services.get(ServersViewModel);
                let viewModel = mainViewModel.serverFileManagementViewModel;
                let hubService = services.get(ServersHubService);
                let actualFiles = undefined;
                hubService.methodCalled.subscribe(event => {
                    if (event.name === 'deleteFiles') {
                        actualFiles = event.args[0];
                    }
                });
                hubService._tempSaveFiles.raise({ Type: CollectionChangeType.Reset, serverId: '1', NewItems: [tempFile, tempFile2] });
                hubService._localSaveFiles.raise({ Type: CollectionChangeType.Reset, serverId: '1', NewItems: [localFile, localFile2] });
                hubService._globalSaveFiles.raise({ Type: CollectionChangeType.Reset, NewItems: [globalFile, globalFile2] });
                testCase.arrange(mainViewModel);
                // Act.
                viewModel.deleteSavesCommand.execute();
                // Assert.
                strict.deepEqual(actualFiles.sort(), testCase.expected.sort());
            });
        }
    });
});
//# sourceMappingURL=serverFileManagementViewModel.spec.js.map