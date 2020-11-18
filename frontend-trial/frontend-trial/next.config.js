const path = require("path");
const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");

const nextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  webpack(config, options) {
    const { isServer } = options;
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve("./components"),
      "@public": path.resolve("./static"),
      "@redux": path.resolve("./redux"),
      "@utils": path.resolve("./utils"),
    };

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name]-[hash:8].[ext]",
            publicPath: (url) => {
              return `/_next/static/css/${url}`;
            },
            outputPath: `${isServer ? "../" : ""}static/css/`,
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = withPlugins([withCSS], nextConfig);
