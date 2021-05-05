import deepFreeze from 'deep-freeze';
import plotAxisMetadata from './PLOT_AXIS_METADATA.json';
import plotAxisOptions from './plot_axis_options.js';

export const PLOT_AXIS_METADATA = deepFreeze(plotAxisMetadata);
export const PLOT_AXIS_OPTIONS = deepFreeze(plotAxisOptions);
