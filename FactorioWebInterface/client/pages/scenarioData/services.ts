﻿import { ServiceLocator } from "../../utils/serviceLocator";
import { ScenarioDataHubService } from "./scenarioDataHubService";
import { ScenarioDataService } from "./scenarioDataService";
import { ScenarioDataViewModel } from "./scenarioDataViewModel";

export function registerScenarioDataPageServices(serviceLocator: ServiceLocator): ServiceLocator {
    serviceLocator.register(ScenarioDataHubService, () => new ScenarioDataHubService());
    serviceLocator.register(ScenarioDataService, (services) => new ScenarioDataService(services.get(ScenarioDataHubService)));
    serviceLocator.register(ScenarioDataViewModel, (services) => new ScenarioDataViewModel(services.get(ScenarioDataService)));

    return serviceLocator;
}