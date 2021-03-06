import { stringify } from 'qs';
import request from '@/utils/request';
import { OPERATOR_URL , platform_URL } from '../utils/Constants';
import ajax from './ajax';


//修改密码
export async function changePsd(params) {
  // console.log('setRead', params.id);
  return request(`${OPERATOR_URL}/manager/changepsd?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//获取现金流中已结束的流量表
export async function queryCash01(params) {
  return request(`${platform_URL}/platform/querycash?state=1&state=0&operatorId=${params.id}`);
}

//累计销售额
export async function queryTotalamout(params) {
  return request(`${OPERATOR_URL}/manager/operatorsale?operatorId=${params.id}`);
}

//月销售额及日增长比
export async function querySaleMonth(params) {
  return request(`${OPERATOR_URL}/manager/operatoronmonth?operatorId=${params.id}`);
}

//年销售额
export async function querySaleYear(params) {
  return request(`${OPERATOR_URL}/manager/operatoronyear?operatorId=${params.id}`);
}


//累计成交量
export async function queryVolume(params) {
  return request(`${OPERATOR_URL}/manager/totalcount?operatorId=${params.id}`);
}

//本月成交量以及日比
export async function queryVolumeMonth(params) {
  return request(`${OPERATOR_URL}/manager/countonmonth?operatorId=${params.id}`);
}

//本日成交量
export async function queryVolumeOnday(params) {
  return request(`${OPERATOR_URL}/manager/countonday?operatorId=${params.id}`);
}

//年成交量
export async function queryVolumeYear(params) {
  return request(`${OPERATOR_URL}/manager/countonyear?operatorId=${params.id}`);
}


//累计利润
export async function queryProfit(params) {
  return request(`${OPERATOR_URL}/manager/totalcash?operatorId=${params.id}`);
}

//月利润
export async function queryProfitMonth(params) {
  return request(`${OPERATOR_URL}/manager/cashonmonth?operatorId=${params.id}`);
}

//年利润
export async function queryProfitYear(params) {
  return request(`${OPERATOR_URL}/manager/cashonyear?operatorId=${params.id}`);
}

//累计应付
export async function queryDebt(params) {
  return request(`${OPERATOR_URL}/manager/totaldebt?operatorId=${params.id}`);
}

//月应付
export async function queryDebtMonth(params) {
  return request(`${OPERATOR_URL}/manager/debtonmonth?operatorId=${params.id}`);
}

//年应付
export async function queryDebtYear(params) {
  return request(`${OPERATOR_URL}/manager/debtonYear?operatorId=${params.id}`);
}

//运营商排行
export async function queryServerRank(params) {
  return request(`${OPERATOR_URL}/manager/servicerRank?operatorId=${params.id}`);
}

//工单总数
export async function queryTotalWorkorder(params) {
  return request(`${OPERATOR_URL}/manager/totalworkorder?operatorId=${params.id}`);
}

//本年工单总数
export async function queryTotalWorkorderYear(params) {
  return request(`${OPERATOR_URL}/manager/workorderonyear?operatorId=${params.id}`);
}

//本月工单总数
export async function queryTotalWorkorderMonth(params) {
  return request(`${OPERATOR_URL}/manager/workorderonmonth?operatorId=${params.id}`);
}

//意外中止工单 本月
export async function queryBadWorkorderMonth(params) {
  return request(`${OPERATOR_URL}/manager/badworkorderonmonth?operatorId=${params.id}`);
}

//本年意外中止工单
export async function queryBadWorkorderYear(params) {
  return request(`${OPERATOR_URL}/manager/badworkorderonyear?operatorId=${params.id}`);
}

//意外中止工单总数
export async function queryBadWorkorder(params) {
  return request(`${OPERATOR_URL}/manager/badworkorder?operatorId=${params.id}`);
}

//顺利完成工单 - 本月
export async function queryGoodWorkorderMonth(params) {
  return request(`${OPERATOR_URL}/manager/goodworkorderonmonth?operatorId=${params.id}`);
}

//顺利完成工单总数
export async function queryGoodWorkorder(params) {
  return request(`${OPERATOR_URL}/manager/goodworkorder?operatorId=${params.id}`);
}

//本年顺利完成工单
export async function queryGoodWorkorderYear(params) {
  return request(`${OPERATOR_URL}/manager/goodworkorderonyear?operatorId=${params.id}`);
}

//单品分区排行
export async function queryPartitonRank(params) {
  return request(`${OPERATOR_URL}/manager/partitonRank?operatorId=${params.id}`);
}

//查看单品分区
export async function queryPartiton(params) {
  return request(`${OPERATOR_URL}/manager/querypartition?_id=${params.id}`);
}

//查询信息
export async function queryNews(params) {
  // console.log('api', params);
  return request(
    `${OPERATOR_URL}/manager/getnews?receiveId=${params.operator}&read=${params.read}`
  );
}

//查询单个信息
export async function queryOneNews(params) {
  // console.log('queryOneNews', params.id);
  return request(`${OPERATOR_URL}/manager/getnews?_id=${params.id}`);
}

//更新消息已读
export async function setRead(params) {
  // console.log('setRead', params.id);
  return request(`${OPERATOR_URL}/manager/setread?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//查询运营商
export async function queryOperator(id) {
  console.log('api', id);
  return request(`${OPERATOR_URL}/manager/queryoperator?_id=${id}`);
}


//查看现金流量表
export async function queryCash(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/querycash?${stringify(params)}`);
}

//查看运营商合约
export async function queryOperatorContract(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/querycontract?${stringify(params)}`);
}

export async function updateOperator(params) {
  console.log('api1', params);
  return request(`${OPERATOR_URL}/manager/updateoperator?operatorId=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新法人照片
export async function uplegalPersonPhoto(params) {
  console.log('api1', params);
  return request(`${OPERATOR_URL}/manager/addimage?_id=${params.id}`, {
    method: 'POSTIMG',
    body: params,
  });
}

//添加品类
export async function addCategory(params) {
  return request(`${OPERATOR_URL}/manager/addcategory`, {
    method: 'POST',
    body: params,
  });
}

//添加品类
export async function editorCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/updateCategory_O?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//查看品类
export async function queryCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryCategory?${stringify(params)}`);
}

//删除品类
export async function deleteCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/deletecategory?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//上下架品类
export async function uporoffCategory(params) {
  console.log('uporoffCategoryapi', params);
  return request(`${OPERATOR_URL}/manager/uporoff?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//查看工单列表
export async function queryWorkorder(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryworkorder?${stringify(params)}`);
}

//查看单个分区
export async function queryPartition(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querypartition?_id=${params.id}`);
}

//分单-专才列表 传入工单id
export async function queryAssign(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/assign_get?_id=${params.id}`);
}

//派单
export async function assignPost(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/assignpost?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//查看任务分区 传入工单id
export async function queryLog(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/checklog?${stringify(params)}`);
}

//查看专才列表
export async function queryServicer(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryservicer?${stringify(params)}`);
}

//查看专才审核列表
export async function queryApply(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryapply?${stringify(params)}`);
}

//处理专才审核
export async function verifyServicer(params) {
  return request(`${OPERATOR_URL}/manager/verifyservicer?operatorId=${params.operatorId}`, {
    method: 'POST',
    body: params,
  });
}

//查看专才合约
export async function queryContract(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querycontract?${stringify(params)}`);
}

//添加专才合约
export async function addContract(params) {
  return request(`${OPERATOR_URL}/manager/addcontract`, {
    method: 'POST',
    body: params,
  });
}

//查看运营商列表
export async function queryOperatorList() {
  return request(`${platform_URL}/manager/queryoperator`);
}

//查看单品列表
export async function queryItem(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryitem?${stringify(params)}`);
}

//查看单品
export async function queryByItem(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querybyitem?_id=${params.id}`);
}

//查看任务
export async function queryTask(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querytask?_id=${params.id}`);
}

//添加单品
export async function addItem(params) {
  return request(`${OPERATOR_URL}/manager/additem`, {
    // method: 'POSTIMG',
    method: 'POST',
    body: params,
  });
}

//添加单品
export async function changeItemState(params) {
  return request(`${OPERATOR_URL}/manager/changestate?${stringify(params)}`, {
    // method: 'POSTIMG',
    method: 'POST',
    body: params,
  });
}

//返回数据
export async function getData(params) {
  return request(`${OPERATOR_URL}/manager/getdata`);
}

//添加分区
export async function addPartition(params) {
  return request(`${OPERATOR_URL}/manager/addpartition`, {
    method: 'POST',
    body: params,
  });
}

//添加任务
export async function addTask(params) {
  return request(`${OPERATOR_URL}/manager/addtask`, {
    method: 'POST',
    body: params,
  });
}

//添加中断要求
export async function addInterrupt(params) {
  return request(`${OPERATOR_URL}/manager/addInterrupt`, {
    method: 'POST',
    body: params,
  });
}

//更新单品
export async function upItem(params) {
  return request(`${OPERATOR_URL}/manager/updateitem?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新分区
export async function upPartition(params) {
  return request(`${OPERATOR_URL}/manager/updatepartition?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新任务
export async function upTask(params) {
  return request(`${OPERATOR_URL}/manager/updatetask?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新中断要求
//params.id = 中断要求id
export async function upInterrupt(params) {
  return request(`${OPERATOR_URL}/manager/updateinterrupt?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function fakeLogin(params) {
  console.log('params', params);
  return request(`${OPERATOR_URL}/operator/signin`, {
    method: 'POST',
    body: params,
  });
}

export async function getCaptcha() {
  // console.log('img', request(`${OPERATOR_URL}/operator/signin`));
  return request(`${OPERATOR_URL}/operator/signin`);
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
