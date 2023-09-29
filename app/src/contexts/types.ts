export type eventType = {
    type: 'set_joint'
    | 'set_vel'
    | 'set_des'
    | 'set_res'
    | 'move_joint'
    | 'stop_joint'
    | 'rst_home'
    | 'goto_home'
    | 'left_pos'
    | 'right_pos'
    | 'add_pos'
    | 'rmv_pos'
    | 'goto_pos'
    | 'load_seq'
    | 'store_seq';
    value: string | number;
}

export type msgType = {
    type: "info" | "robot" | "success" | "error" | "bind-success" | "bind-recover" | "bind-info" | "bind-error" | "unbind-error" | "unbind-success";
    content: string[];
  };

export type credentials = {
    name: string;
    password: string;
}

export type connections = {
    server: boolean,
    robot: boolean,
}