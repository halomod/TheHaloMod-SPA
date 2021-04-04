import deepFreeze from 'deep-freeze';
import plotAxisMetadata from './PLOT_AXIS_METADATA.json';
import plotAxisOptions from './PLOT_AXIS_OPTIONS.json';

export const PLOT_AXIS_METADATA = deepFreeze(plotAxisMetadata);
export const PLOT_AXIS_OPTIONS = deepFreeze(plotAxisOptions);
