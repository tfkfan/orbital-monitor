export interface IGatewayInfo {
  nodeId?: any;
  address?: string;
  port?: number
}

export const defaultValue: Readonly<IGatewayInfo> = {
  nodeId: '',
  address: '',
  port: null
};
