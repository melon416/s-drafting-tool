import React from 'react';
import { initializeIcons } from '@uifabric/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { registerIcons } from '@uifabric/styling';

import {
  Notifications,
  AccountCircle,
  ExpandMore,
  NavigateNext,
  Edit,
  WorkOutline,
  Add,
  Lock,
  Check,
  DeleteOutline,
  NotificationsNone,
  NotificationsActive,
  WorkOffOutlined,
  SyncProblem,
  LiveHelp,
  TimelineOutlined,
  VerticalSplit,
  MoreHoriz,
} from '@material-ui/icons';

// uncomment to use Fabric UI icons
initializeIcons();

const iconFontSize = 'small';

registerIcons({
  icons: {
    Plus: <Add fontSize={iconFontSize} />,
    Notifications: <Notifications fontSize={iconFontSize} />,
    AccountCircle: <AccountCircle />,
    ExpandMore: <ExpandMore fontSize={iconFontSize} />,
    NavigateNext: <NavigateNext fontSize={iconFontSize} />,
    Pencil: <Edit fontSize={iconFontSize} />,
    WorkOutline: <WorkOutline fontSize={iconFontSize} />,
    LockClosed: <Lock fontSize={iconFontSize} />,
    Check: <Check fontSize={iconFontSize} />,
    DeleteOutline: <DeleteOutline fontSize={iconFontSize} />,
    NotificationsActive: <NotificationsActive fontSize={iconFontSize} />,
    NotificationsNone: <NotificationsNone fontSize={iconFontSize} />,
    WorkOffOutlined: <WorkOffOutlined fontSize={iconFontSize} />,
    SyncProblem: <SyncProblem />,
    TimelineOutlined: <TimelineOutlined fontSize={iconFontSize} />,
    LiveHelp: <LiveHelp fontSize={iconFontSize} />,
    VerticalSplit: <VerticalSplit />,
    MoreHoriz: <MoreHoriz fontSize={iconFontSize} />,
  },
});
