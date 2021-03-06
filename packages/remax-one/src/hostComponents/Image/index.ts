import createHostComponent from '../../createHostComponent';
import ImageProps from './props';
import defaults from './props/default';

export type { ImageProps };

const Image = createHostComponent<ImageProps>('image', null, defaults);

export default Image;
