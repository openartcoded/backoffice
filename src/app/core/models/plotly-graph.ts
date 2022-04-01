export interface PlotlyGraph {
  title?: string;
  data: PlotlyData[];
  layout: PlotlyLayout;
  config?: PlotlyConfig;
}
export interface PlotlyConfig {
  responsive?: boolean;
  displayModeBar?: boolean;
}
export interface PlotlyLayout {
  width?: string;
  height?: string;
  title?: string;
  showlegend?: boolean;
  yaxis?: any;
  xaxis?: any;
}
export interface PlotlyData {
  x: number[] | string[] | Date[];
  y: number[] | string[] | Date[];
  type?: string;
  mode?: string;
  orientation?: string;
  marker?: any;
  name?: string;
}
