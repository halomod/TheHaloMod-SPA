import deepFreeze from 'deep-freeze';
import plotData from '@/../../globals/plotData.json';
import plotTypes from '@/../../globals/plotTypes.json';

export const PLOT_DATA = deepFreeze(plotData);
export const PLOT_TYPES = deepFreeze(plotTypes);
