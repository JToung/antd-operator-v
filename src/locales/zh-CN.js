import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import editor from './zh-CN/editor';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  'app.operators.basic.title': '运营商基础信息',
  'app.categoty.basic.title': '服务品类包管理',
  'app.item.basic.title': '服务单品包管理',
  'app.workorder.basic.title': '工单管理',
  'app.servicer.basic.title': '专才管理',
  'app.label.basic.title': '服务品类标签管理',
  'app.categoty.list.title': '服务品类包列表',
  'app.item.list.title': '服务单品包列表',
  'app.workorder.list.title': '工单列表',
  'app.workorder.assign.title': '工单派单',
  'app.servicer.list.title': '专才列表',
  'app.label.list.title': '服务品类标签列表',
  'app.messages.list.title': '消息列表',
  'app.messages.basic.title': '消息管理',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...editor,
};
