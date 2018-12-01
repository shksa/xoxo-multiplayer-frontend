import React from 'react'

export interface SVGProps {
  fillColor?: string,
  width?: string,
  height?: string
}

export const BarsLoader = ({fillColor="white", width = "135", height = "140"}: SVGProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill={fillColor}>
    <rect y="10" width="15" height="120" rx="6">
        <animate attributeName="height"
             begin="0.5s" dur="1s"
             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
             repeatCount="indefinite" />
        <animate attributeName="y"
             begin="0.5s" dur="1s"
             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
             repeatCount="indefinite" />
    </rect>
    <rect x="30" y="10" width="15" height="120" rx="6">
        <animate attributeName="height"
             begin="0.25s" dur="1s"
             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
             repeatCount="indefinite" />
        <animate attributeName="y"
             begin="0.25s" dur="1s"
             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
             repeatCount="indefinite" />
    </rect>
    <rect x="60" width="15" height="140" rx="6">
        <animate attributeName="height"
             begin="0s" dur="1s"
             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
             repeatCount="indefinite" />
        <animate attributeName="y"
             begin="0s" dur="1s"
             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
             repeatCount="indefinite" />
    </rect>
    <rect x="90" y="10" width="15" height="120" rx="6">
        <animate attributeName="height"
             begin="0.25s" dur="1s"
             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
             repeatCount="indefinite" />
        <animate attributeName="y"
             begin="0.25s" dur="1s"
             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
             repeatCount="indefinite" />
    </rect>
    <rect x="120" y="10" width="15" height="120" rx="6">
        <animate attributeName="height"
             begin="0.5s" dur="1s"
             values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
             repeatCount="indefinite" />
        <animate attributeName="y"
             begin="0.5s" dur="1s"
             values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
             repeatCount="indefinite" />
    </rect>
</svg>
  )
}

export const ThreeBallsLoader = ({fillColor="black", width="120", height="30"}: SVGProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill={fillColor}>
      <circle cx="15" cy="15" r="15">
        <animate 
          attributeName="r" from="15" to="15"
          begin="0s" dur="0.8s"
          values="15;9;15" calcMode="linear"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="fill-opacity" from="1" to="1"
          begin="0s" dur="0.8s"
          values="1;.5;1" calcMode="linear"
          repeatCount="indefinite" 
        />
      </circle>
      <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate 
          attributeName="r" from="9" to="9"
          begin="0s" dur="0.8s"
          values="9;15;9" calcMode="linear"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="fill-opacity" from="0.5" to="0.5"
          begin="0s" dur="0.8s"
          values=".5;1;.5" calcMode="linear"
          repeatCount="indefinite" 
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate 
          attributeName="r" from="15" to="15"
          begin="0s" dur="0.8s"
          values="15;9;15" calcMode="linear"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="fill-opacity" from="1" to="1"
          begin="0s" dur="0.8s"
          values="1;.5;1" calcMode="linear"
          repeatCount="indefinite" 
        />
      </circle>
    </svg>
  )
}

export const RingsLoader = ({width="45", height="45", fillColor="white"}: SVGProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke={fillColor}>
        <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
            <circle cx="22" cy="22" r="6" stroke-opacity="0">
                <animate attributeName="r"
                    begin="1.5s" dur="3s"
                    values="6;22"
                    calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="stroke-opacity"
                    begin="1.5s" dur="3s"
                    values="1;0" calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="stroke-width"
                    begin="1.5s" dur="3s"
                    values="2;0" calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
            <circle cx="22" cy="22" r="6" stroke-opacity="0">
                <animate attributeName="r"
                    begin="3s" dur="3s"
                    values="6;22"
                    calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="stroke-opacity"
                    begin="3s" dur="3s"
                    values="1;0" calcMode="linear"
                    repeatCount="indefinite" />
                <animate attributeName="stroke-width"
                    begin="3s" dur="3s"
                    values="2;0" calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
            <circle cx="22" cy="22" r="8">
                <animate attributeName="r"
                    begin="0s" dur="1.5s"
                    values="6;1;2;3;4;5;6"
                    calcMode="linear"
                    repeatCount="indefinite" />
            </circle>
        </g>
    </svg>
  )
}

export const BallTriangleLoader = ({width="57", height="57", fillColor="white"}: SVGProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke={fillColor}>
    <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="2">
            <circle cx="5" cy="50" r="5">
                <animate attributeName="cy"
                     begin="0s" dur="2.2s"
                     values="50;5;50;50"
                     calcMode="linear"
                     repeatCount="indefinite" />
                <animate attributeName="cx"
                     begin="0s" dur="2.2s"
                     values="5;27;49;5"
                     calcMode="linear"
                     repeatCount="indefinite" />
            </circle>
            <circle cx="27" cy="5" r="5">
                <animate attributeName="cy"
                     begin="0s" dur="2.2s"
                     from="5" to="5"
                     values="5;50;50;5"
                     calcMode="linear"
                     repeatCount="indefinite" />
                <animate attributeName="cx"
                     begin="0s" dur="2.2s"
                     from="27" to="27"
                     values="27;49;5;27"
                     calcMode="linear"
                     repeatCount="indefinite" />
            </circle>
            <circle cx="49" cy="50" r="5">
                <animate attributeName="cy"
                     begin="0s" dur="2.2s"
                     values="50;50;5;50"
                     calcMode="linear"
                     repeatCount="indefinite" />
                <animate attributeName="cx"
                     from="49" to="49"
                     begin="0s" dur="2.2s"
                     values="49;5;27;49"
                     calcMode="linear"
                     repeatCount="indefinite" />
            </circle>
        </g>
    </g>
</svg>
  )
}