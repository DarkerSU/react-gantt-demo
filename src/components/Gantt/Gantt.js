import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { gantt } from 'dhtmlx-gantt';
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

// import {gantt} from '../../dhtmlx/dhtmlxgantt';
// import '../../dhtmlx/dhtmlxgantt.css'

const gantt = window.dhtmlxgantt.gantt
export default class index extends Component {

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
          min_column_width: 80,
          scales: [
            { unit: "year", step: 1, format: '%Y' },
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
  curdamnd(obj) {
    console.log('111', obj)
  }
  ganttConfig() {
    gantt.config.columns = [
      { name: "text", label: "需求标题", align: "center", width: '*' },
      { name: "text", label: "需求编号", align: "center", width: '*' },
      { name: "text", label: "处理人", align: "center", width: '*' },
      { name: "text", label: "创建人", align: "center", width: '*' },
      // { name: "duration", label: "进度", align: "center" },
      { name: "start_date", label: "计划开始时间", align: "center" },
      { name: "end_date", label: "计划结束时间", align: "center" },
      { name: "planned_start", label: "实际开始时间", },
      { name: "planned_end", label: "实际结束时间" },
      { name: "create_time", label: "创建时间" },
      {
        name: "external", label: "操作", width: 80, align: "center", onrender: (item, node) => {
          return <button onClick={() => this.curdamnd(item)} >详情</button>
        },

      }
    ];

    gantt.config.external_render = {
      // checks the element is a React element
      isElement: (element) => {
        return React.isValidElement(element);
      },
      // renders the React element into the DOM
      renderElement: (element, container) => {
        ReactDOM.render(element, container);
      }
    }
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.bar_height = 17;
    // gantt.config.readonly = true;
    gantt.config.autoscroll = true;
    gantt.config.details_on_dblclick = false;
    gantt.config.drag_timeline = {
      ignore: ".gantt_task_line, .gantt_task_link",
      useKey: true
    };
    // gantt.config.grid_elastic_columns = false;
    gantt.config.show_chart = true;
    // gantt.config.autoscroll = true;
    // gantt.config.drag_move = false;
    // gantt.config.drag_progress = false;
    // gantt.config.drag_lightbox = false;
    // gantt.config.drag_links = false;
    // gantt.config.select_task = false;
    // gantt.config.horizontal_scroll_key = "altKey";
    gantt.config.initial_scroll = true;
    gantt.config.row_height = 50;
    gantt.config.touch = "force";
    // gantt.config.touch_drag = 75;
    // gantt.config.resize_rows = true;
    // gantt.config.min_task_grid_row_height = 85;
    gantt.config.show_grid = false;
    // gantt.config.show_task_cells = false;
    gantt.config.scroll_size = 20;
    gantt.config.show_progress = false;
    // gantt.config.lightbox.sections = [
    //   { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
    //   { name: "time", height: 72, map_to: "auto", type: "duration" }
    // ];
    gantt.addTaskLayer({
      renderer: {
        render: function draw_planned(task) {
          if (task.planned_start && task.planned_end) {
            var sizes = gantt.getTaskPosition(task, new Date(task.planned_start), new Date(task.planned_end));
            var el = document.createElement('div');
            el.className = 'baseline';
            el.style.left = sizes.left - 1 + 'px';
            el.style.width = sizes.width - 1 + 'px';
            el.style.top = sizes.top + gantt.config.bar_height - 12 + 'px';
            return el;
          }
          return false;
        },
        // define getRectangle in order to hook layer with the smart rendering
        getRectangle: function (task, view) {
          if (task.planned_start && task.planned_end) {
            return gantt.getTaskPosition(task, new Date(task.planned_start), new Date(task.planned_end));
          }
          return null;
        }
      }
    });
    gantt.i18n.setLocale('cn')
  }
  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {

    this.ganttConfig();
    const { tasks } = this.props;
    console.log(this.ganttContainer)
    gantt.init(this.ganttContainer);
    // this.initGanttDataProcessor();
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
    this.setZoom(zoom);
    return (
      <div className="gantt-layout">
        <div className="gantt-layout-left"> 111</div>
        <div ref={(input) => { this.ganttContainer = input }} className="gantt-layout-right"></div>
      </div>
    );
  }
}
