import {
  queryOperator,
  updateOperator,
  uplegalPersonPhoto,
  queryOperatorContract,
  queryCash,
  queryCash01,
  queryTotalamout,
  querySaleMonth,
  querySaleYear,
  queryVolume,
  queryVolumeMonth,
  queryVolumeYear,
  queryVolumeOnday,
  queryProfit,
  queryProfitMonth,
  queryProfitYear,
  queryDebt,
  queryDebtMonth,
  queryDebtYear,
  queryServerRank,
  changePsd
} from '@/services/api';

export default {
  namespace: 'operator',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *fetchOperator({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryOperator, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response', response);
      return response;
    },
    *upOperator({ payload }, { call, put }) {
      console.log('payload1', payload);
      const response = yield call(updateOperator, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response1', response);
      return response;
    },
    *uplegalPersonPhoto({ payload }, { call, put }) {
      console.log('saveIMG', payload);
      const response = yield call(uplegalPersonPhoto, payload);
      yield put({
        type: 'saveIMG',
        payload: response,
      });
      console.log('IMGresponse1', response);
      return response;
    },
    *queryContract({ payload }, { call, put }) {
      console.log('payload1', payload);
      const response = yield call(queryOperatorContract, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryOperatorContract', response);
      return response;
    },
    *queryCash({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryCash, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryCash', response);
      return response;
    },
    *queryCash01({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryCash01, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryCash01', response);
      return response;
    },
    *queryTotalamout({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryTotalamout, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalamout', response);
      return response;
    },
    *querySaleMonth({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(querySaleMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('querySaleMonth', response);
      return response;
    },
    *querySaleYear({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(querySaleYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('querySaleYear', response);
      return response;
    },
    *queryVolume({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryVolume, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolume', response);
      return response;
    },
    *queryVolumeMonth({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryVolumeMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeMonth', response);
      return response;
    },
    *queryVolumeYear({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryVolumeYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeYear', response);
      return response;
    },
    *queryVolumeOnday({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryVolumeOnday, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeOnday', response);
      return response;
    },
    *queryProfit({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryProfit, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfit', response);
      return response;
    },
    *queryProfitMonth({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryProfitMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfitMonth', response);
      return response;
    },
    *queryProfitYear({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryProfitYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfitYear', response);
      return response;
    },
    *queryDebt({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryDebt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryDebt', response);
      return response;
    },
    *queryDebtMonth({ payload }, { call, put }) {
      console.log('存入值save', payload);
      const response = yield call(queryDebtMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('返回值queryDebtMonth', response);
      return response;
    },
    *queryDebtYear({ payload }, { call, put }) {
      console.log('传入值save', payload);
      const response = yield call(queryDebtYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryDebtYear', response);
      return response;
    },
    *queryServerRank({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryServerRank, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryServerRank', response);
      return response;
    },
    *changePsd({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(changePsd, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('changePsd', response);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveIMG(state, action) {
      return {
        ...state,
        url: action.payload,
      };
    },
  },
};
