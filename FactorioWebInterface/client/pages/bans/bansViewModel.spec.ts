﻿import { strict } from "assert";
import { BansPageTestServiceLocator } from "../../testUtils/testServiceLocator";
import { BansHubService } from "./bansHubService";
import { BansHubServiceMockBase } from "../../testUtils/pages/bans/bansHubServiceMockBase";
import { BansViewModel } from "./bansViewModel";
import { CollectionChangeType } from "../../ts/utils";
import { Ban } from "./ban";
import { IterableHelper } from "../../utils/iterableHelper";
import { ValidationResult } from "../../utils/validation/module";
import { assertValidationResultEqual } from "../../testUtils/utils/validation";

const bans: Ban[] = [
    {
        Username: 'ghi',
        Admin: 'admin',
        Reason: 'reason',
        DateTime: new Date('2020-01-01 00:00:00')
    },
    {
        Username: 'def',
        Admin: 'admin',
        Reason: 'reason',
        DateTime: new Date('2020-01-02 00:00:00')
    },
    {
        Username: 'abc',
        Admin: 'admin',
        Reason: 'reason',
        DateTime: new Date('2020-01-03 00:00:00')
    }
];

describe('BansViewModel', function () {
    it('requests bans when first loading', function () {
        // Arrange.
        let services = new BansPageTestServiceLocator();

        let hub: BansHubServiceMockBase = services.get(BansHubService);
        hub.methodCalled.subscribe(event => {
            if (event.name === 'whenConnection') {
                const callback: () => void = event.args[0];
                callback();
            }
        });

        // Act.        
        let viewModel: BansViewModel = services.get(BansViewModel);

        // Assert.
        hub.assertMethodCalled('requestBans');
    });

    it('requests bans when hub connection starts', function () {
        // Arrange.
        let services = new BansPageTestServiceLocator();
        let hub: BansHubServiceMockBase = services.get(BansHubService);
        let viewModel: BansViewModel = services.get(BansViewModel);

        // Act.
        hub._onConnection.raise();

        // Assert.
        hub.assertMethodCalled('requestBans');
    });

    it('bans collection updates onSendBans', function () {
        // Arrange.
        let services = new BansPageTestServiceLocator();
        let hub: BansHubServiceMockBase = services.get(BansHubService);
        let viewModel: BansViewModel = services.get(BansViewModel);

        // Act.
        hub._onSendBans.raise({ Type: CollectionChangeType.Reset, NewItems: bans })

        // Assert.
        let actual = IterableHelper.map(viewModel.bans, a => a.Username);
        // should be sorted by date.
        let expected = ['abc', 'def', 'ghi'];
        strict.deepEqual([...actual], expected);
    });

    describe('validation', function () {
        let testCases = [
            { name: 'username empty', property: 'username', value: '', expected: ValidationResult.error('Username must not be empty.') },
            { name: 'reason empty', property: 'reason', value: '', expected: ValidationResult.error('Reason must not be empty.') },
            { name: 'admin empty', property: 'admin', value: '', expected: ValidationResult.error('Admin must not be empty.') },
            { name: 'date null', property: 'date', value: null, expected: ValidationResult.error('Date must not be null.') },
            { name: 'time null', property: 'time', value: null, expected: ValidationResult.error('Time must not be null.') },
        ];

        for (let testCase of testCases) {
            it(testCase.name, function () {
                // Arrange.
                let services = new BansPageTestServiceLocator();
                let viewModel: BansViewModel = services.get(BansViewModel);

                viewModel.username = 'username';
                viewModel.reason = 'reason';
                viewModel.admin = 'admin';

                // Act.
                viewModel[testCase.property] = testCase.value;

                // Assert.
                let actual = viewModel.errors.getError(testCase.property);
                assertValidationResultEqual(actual, testCase.expected);
            });
        }

        it('all valid', function () {
            // Arrange.
            let services = new BansPageTestServiceLocator();
            let viewModel: BansViewModel = services.get(BansViewModel);

            // Act.
            viewModel.username = 'username';
            viewModel.reason = 'reason';
            viewModel.admin = 'admin';
            let date = new Date();
            viewModel.date = date;
            viewModel.time = date;

            // Assert.
            strict.equal(viewModel.errors.hasErrors, false);
        });
    });

    describe('add ban command', function () {
        it('can execute', function () {
            // Arrange.
            let services = new BansPageTestServiceLocator();

            let hub: BansHubServiceMockBase = services.get(BansHubService);
            let ban: Ban;
            let synchronizeWithServers: boolean;
            hub.methodCalled.subscribe(event => {
                if (event.name === 'addBan') {
                    ban = event.args[0];
                    synchronizeWithServers = event.args[1];
                }
            });

            let viewModel: BansViewModel = services.get(BansViewModel);
            viewModel.username = 'username';
            viewModel.reason = 'reason';
            viewModel.admin = 'admin';
            let date = new Date('2020-01-01 00:00:00');
            viewModel.date = date;
            viewModel.time = date;
            viewModel.synchronizeWithServers = true;

            // Act.
            strict.equal(viewModel.addBanCommand.canExecute(), true);
            viewModel.addBanCommand.execute();

            // Assert.
            strict.equal(ban.Username, 'username');
            strict.equal(ban.Reason, 'reason');
            strict.equal(ban.Admin, 'admin');
            strict.equal(ban.DateTime.toString(), date.toString());
            strict.equal(synchronizeWithServers, true);
        });

        it('can not execute when validation error', function () {
            // Arrange.
            let services = new BansPageTestServiceLocator();

            let hub: BansHubServiceMockBase = services.get(BansHubService);
            let actualEvent;
            hub.methodCalled.subscribe(event => {
                if (event.name === 'addBan') {
                    actualEvent = event;
                }
            });

            let viewModel: BansViewModel = services.get(BansViewModel);

            // Act.
            viewModel.addBanCommand.execute();

            // Assert.
            strict.equal(viewModel.addBanCommand.canExecute(), false);
            strict.equal(actualEvent, undefined);
        });
    });

    describe('remove ban command', function () {
        it('can execute', function () {
            // Arrange.
            let services = new BansPageTestServiceLocator();

            let viewModel: BansViewModel = services.get(BansViewModel);
            viewModel.synchronizeWithServers = true;

            let hub: BansHubServiceMockBase = services.get(BansHubService);
            let username: string;
            let synchronizeWithServers: boolean;
            hub.methodCalled.subscribe(event => {
                if (event.name === 'removeBan') {
                    username = event.args[0];
                    synchronizeWithServers = event.args[1];
                }
            });

            hub._onSendBans.raise({ Type: CollectionChangeType.Reset, NewItems: bans });

            // Act.
            viewModel.removeBanCommand.execute(bans[1]);

            // Assert.
            strict.equal(username, bans[1].Username);
            strict.equal(synchronizeWithServers, true);
        });
    });

    it('updates form when click on ban row', function () {
        // Arrange.
        let services = new BansPageTestServiceLocator();
        let hub: BansHubServiceMockBase = services.get(BansHubService);
        let viewModel: BansViewModel = services.get(BansViewModel);

        hub._onSendBans.raise({ Type: CollectionChangeType.Reset, NewItems: bans })

        let ban = [...viewModel.bans][1];

        // Act.
        viewModel.updateFormFromBan(ban);

        // Assert.
        strict.equal(viewModel.username, ban.Username);
        strict.equal(viewModel.reason, ban.Reason);
        strict.equal(viewModel.admin, ban.Admin);
        strict.equal(viewModel.date, ban.DateTime);
        strict.equal(viewModel.time, ban.DateTime);
    });

    it('updates form when remove ban', function () {
        // Arrange.
        let services = new BansPageTestServiceLocator();
        let hub: BansHubServiceMockBase = services.get(BansHubService);
        let viewModel: BansViewModel = services.get(BansViewModel);

        hub._onSendBans.raise({ Type: CollectionChangeType.Reset, NewItems: bans })

        let ban = [...viewModel.bans][1];

        // Act.
        viewModel.removeBanCommand.execute(ban);

        // Assert.
        strict.equal(viewModel.username, ban.Username);
        strict.equal(viewModel.reason, ban.Reason);
        strict.equal(viewModel.admin, ban.Admin);
        strict.equal(viewModel.date, ban.DateTime);
        strict.equal(viewModel.time, ban.DateTime);
    });
});