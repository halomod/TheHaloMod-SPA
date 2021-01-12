/**
 * Used to define where the github pages location of the deployed site will
 * be.
 */

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/TheHaloMod-SPA/'
    : '/'
}