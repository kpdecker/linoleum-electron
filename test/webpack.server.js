import webpackConfig from '../src/webpack';

import {expect} from 'chai';

describe('webpack config', function() {
  it('should provide electron specifics', function() {
    let config = webpackConfig();
    expect(config.devtool).to.equal('source-map');
  });
  it('should handle custom config', function() {
    let config = webpackConfig({});
    expect(config.devtool).to.equal('source-map');
  });
});
