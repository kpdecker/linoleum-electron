import webpackConfig, {nodeExternals} from 'linoleum-webpack/src/webpack';

export default function(options = {}) {
  let ret = webpackConfig(options);

  ret.target = 'electron';
  ret.devtool = 'source-map';
  ret.externals = nodeExternals;

  return ret;
}
