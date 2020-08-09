import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'ngx-echarts-bar-sse',
    template: `
    <div class="highcharts">
    <highcharts-chart
   [Highcharts] = "highcharts"
   [options] = "columnChart"
   style = "width: 100%; height: 400px; display: block;">
</highcharts-chart>
    </div>
  `,
})
export class EchartsStreamBarComponent {
    title = 'myHighchart';

    highcharts = Highcharts;

    columnChart = {
        chart: {
            type: 'column',
            marginRight: 10,
            events: {
                load: function () {

                    const source = new EventSource('https://calix-dev.apigee.net/streaming/sse');
                    source.addEventListener('message', message => {
                        const myData = JSON.parse(message.data);
                        const series = this.series[0];
                        const data = [];
                        myData['upData'].forEach(up => {
                            data.push(up.value);
                        });
                        series.setData(data);
                    });
                }
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    }
}
