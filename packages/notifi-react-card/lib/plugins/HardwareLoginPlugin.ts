export interface HardwareLoginPlugin {
  sendMessage: (message: string) => Promise<string>;
}
