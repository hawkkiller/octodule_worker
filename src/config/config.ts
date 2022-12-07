interface IConfig {
  readonly rabbitMQHost: string;
}

interface GetConfigParams {
  readonly reload?: boolean;
}

const getConfigDefaults: GetConfigParams = {
  reload: false,
};

class Config {
  constructor({ rabbitMQHost }: IConfig) {
    this.rabbitMQHost = rabbitMQHost;
  }

  readonly rabbitMQHost: string;

  static config: Config | undefined;

  /**
   * @returns The config object
   * @param args
   */
  public static getConfig(args?: GetConfigParams): Config {
    args = { ...getConfigDefaults, ...args };

    if (Config.config && (!args?.reload ?? false)) {
      return Config.config;
    }
    const rabbitMQHost = this.fromEnv('RABBIT_MQ_HOST');

    // Resulting config object
    const config = new Config({
      rabbitMQHost: rabbitMQHost,
    });
    Config.config = config;
    return config;
  }

  private static fromEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`${key} is not set`);
    }
    return value;
  }

}

export { Config };