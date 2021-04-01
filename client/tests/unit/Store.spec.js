import Store from '@/utils/Store.js';
import Vue from 'vue';
import isEqual from 'lodash.isequal';
import { DEFAULT_FORM_STATE } from '@/constants/backend_constants.js';
import makeServer from '../mockServer';

// Disable dev notice info logs. Just a quality of life thing.
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Store tests', () => {
  let defaultModel;
  let store;
  let server;
  beforeAll(async () => {
    server = makeServer('test');
    store = new Store();
    expect(store).toBeDefined();
    await store.init();
    defaultModel = DEFAULT_FORM_STATE;
    expect(store.state.plot.y).toBeDefined();
    expect(store.state.plot.x).toBeDefined();
  });

  // Clearing of store after each test
  afterEach(async () => {
    const modelNames = store.getModelNames();
    await Promise.all(modelNames.map((modelName) => store.deleteModel(modelName)));
  });

  afterAll(() => {
    server.shutdown();
  });

  test('Store should be initialized', () => {
    expect(store.state.plot.y).toBeDefined();
    expect(store.state.plot.x).toBeDefined();
  });

  test('Store should retrieve no model names if no models have been added', () => {
    expect(store.getModelNames().length === 0).toBeTruthy();
  });

  test('Store should be able to create models and return them', async () => {
    const testModelName1 = 'Some test model';
    await store.createModel(defaultModel, testModelName1);
    expect(store.getModelNames().length === 1).toBeTruthy();
    await store.createModel(defaultModel, 'Some other test model');
    expect(store.getModelNames()).toContain(testModelName1);
  });

  test('Store should be able to create models and delete them', async () => {
    const testModelName1 = 'Some test model';
    await store.createModel(defaultModel, testModelName1);
    expect(store.getModelNames().length === 1).toBeTruthy();
    await store.createModel(defaultModel, 'Some other test model');
    expect(store.getModelNames()).toHaveLength(2);
    await store.deleteModel(testModelName1);
    expect(store.getModelNames().includes(testModelName1)).toBeFalsy();
  });

  test('Cloning a model should add one and keep the original', async () => {
    const testModelName1 = 'Some test model';
    const testModelName2 = 'Some other test model';
    await store.createModel(defaultModel, testModelName1);
    expect(store.getModelNames().length === 1).toBeTruthy();
    await store.cloneModel(testModelName1, testModelName2);
    const modelNames = store.getModelNames();
    expect(modelNames).toContain(testModelName1);
    expect(modelNames).toContain(testModelName2);
  });

  test('Renaming model should create one and remove the original', async () => {
    const oldModelName = 'Model';
    const newModelName = 'Renamed Model';
    await store.createModel(defaultModel, oldModelName);
    expect(store.getModelNames()).toContain(oldModelName);
    await store.renameModel(oldModelName, newModelName);
    expect(store.getModelNames()).not.toContain(oldModelName);
    expect(store.getModelNames()).toContain(newModelName);
  });

  test('Clearing models should remove all existing models', async () => {
    await store.createModel(defaultModel, 'MyModel');
    await store.createModel(defaultModel, 'AnotherModel');
    await store.createModel(defaultModel, 'AndAnotherOne');
    expect(store.getModelNames()).toHaveLength(3);
    await store.clearModels();
    expect(store.getModelNames()).toHaveLength(0);
  });

  test('Changing the plot type should reflect in state', async () => {
    const newPlotType = 'somePlotType';
    await store.setPlotType(newPlotType, 'x', false);
    await store.setPlotType(newPlotType, 'y', false);
    expect(store.state.plot.x).toBe(newPlotType);
    expect(store.state.plot.y).toBe(newPlotType);
  });

  test('Getting a model should return its data', async () => {
    const testModelName1 = 'Some test model';
    await store.createModel(defaultModel, testModelName1);
    const returnedModel = await store.getModel(testModelName1);
    expect(isEqual(returnedModel, defaultModel)).toBeTruthy();
  });

  test('Getting a model returns null if a model doesnt exist', async () => {
    const returnedValue1 = await store.getModel('Some model not there');
    expect(returnedValue1).toBeUndefined();
    await store.createModel(defaultModel, 'Some test model');
    const returnedValue2 = await store.getModel('Some other model');
    expect(returnedValue2).toBeUndefined();
  });

  test('Adding models and getting all models should return all of the models', async () => {
    const testModelName1 = 'Some test model';
    const testModelName2 = 'Some other test model';
    await store.createModel(defaultModel, testModelName1);
    expect(store.getModelNames().length === 1).toBeTruthy();
    await store.createModel(defaultModel, testModelName2);
    expect(store.getModelNames()).toContain(testModelName2);
    const allModels = await store.getAllModels();
    expect(typeof allModels === 'object').toBeTruthy();
    expect(allModels[testModelName1]).toBeDefined();
    expect(allModels[testModelName2]).toBeDefined();
  });
});
