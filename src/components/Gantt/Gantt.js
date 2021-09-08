import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Hours',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: 'Days',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'month', step: 1, format: '%F' },
            { unit: 'day', step: 1, format: '%d' }
          ]
        },
        {
          name: 'Months',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: "month", step: 1, format: '%F' },
            { unit: 'week', step: 1, format: '#%W' }
          ]
        }
      ]
    });
  }

  setZoom(value) {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */

    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }
        // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
        // resolve({id: databaseId});
        return resolve();
      });
    });
  }
  ganttConfig() {
    console.log('message')
    gantt.config.columns = [
      { name: "text", label: "需求名称",  align: "center",width: '*' },
      { name: "start_date", label: "开始时间", align: "center" },
      { name: "duration", label: "进度", align: "center" },
      // {name:"add",        label:"" }
    ];


    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.bar_height = 16;
    gantt.config.readonly = true;
    gantt.config.autoscroll = false;
    gantt.config.details_on_dblclick = true;
    // gantt.config.autoscroll = true;
    // gantt.config.drag_move = false;
    // gantt.config.drag_progress = false;
    // gantt.config.drag_lightbox = false;
    // gantt.config.drag_links = false;
    // gantt.config.select_task = false;
    // gantt.config.horizontal_scroll_key = "altKey";
    // gantt.config.initial_scroll = true;
    gantt.config.row_height = 45;
    gantt.config.touch = "force";
    gantt.config.touch_drag = 75;
    // gantt.config.bar_height = 50;
    gantt.config.resize_rows = true;
    // gantt.config.min_task_grid_row_height = 85;
    // gantt.config.show_grid = true;
    gantt.config.show_task_cells = false;
    gantt.config.scroll_size = 20;
    gantt.config.show_progress = false;
    // gantt.config.lightbox.sections = [
    //   { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
    //   { name: "time", height: 72, map_to: "auto", type: "duration" }
    // ];
    // gantt.addTaskLayer({
    //   renderer: {
    //     render: function draw_planned(task) {
    //       if (task.planned_start && task.planned_end) {
    //         var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
    //         var el = document.createElement('div');
    //         el.className = 'baseline';
    //         el.style.left = sizes.left + 'px';
    //         el.style.width = sizes.width + 'px';
    //         el.style.top = sizes.top + gantt.config.bar_height + 13 + 'px';
    //         return el;
    //       }
    //       return false;
    //     },
    //     // define getRectangle in order to hook layer with the smart rendering
    //     getRectangle: function(task, view){
    //       if (task.planned_start && task.planned_end) {
    //         return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
    //       }
    //       return null;
    //     }
    //   }
    // });
    gantt.locale.date={
				month_full: ["1", "2月", "3", "4", "5", "6",
					"7", "8", "9", "10", "11", "12"],
				month_short: ["1", "2月", "3", "4", "5", "6",
					"7", "8", "9", "10", "11", "12"],
				day_full: ["日", "一", "二", "三", "四", "五", "六"],
				day_short: ["日", "一", "二", "三", "四", "五", "六"]
			}
		;
  }
  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {

    this.ganttConfig();
    const { tasks } = this.props;
    // gantt.locale;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    console.log(zoom)
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}
