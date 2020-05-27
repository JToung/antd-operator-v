import {
    queryWorkorder,
    queryPartition,
    queryAssign,
    assignPost,
    queryLog,
    queryTotalWorkorder,
    queryTotalWorkorderMonth,
    queryBadWorkorderMonth,
    queryBadWorkorder,
    queryGoodWorkorderMonth,
    queryPartitonRank,
    queryTotalWorkorderYear,
    queryBadWorkorderYear,
    queryGoodWorkorderYear,
    queryGoodWorkorder
  } from '@/services/api';
  
  export default {
    namespace: 'workorder',
  
    state: {
      //用来保存数据
      data: [],
    },
  
    effects: {
      *queryWorkorder({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryWorkorder, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryWorkorder', response);
        return response;
      },
      *queryPartition({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryPartition, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryPartition', response);
        return response;
      },
      *queryAssign({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryAssign, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryAssign', response);
        return response;
      },
      *assignPost({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(assignPost, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('assignPost', response);
        return response;
      },
      *queryLog({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryLog, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryLog', response);
        return response;
      },
      *queryTotalWorkorder({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryTotalWorkorder, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryTotalWorkorder', response);
        return response;
      },
      *queryTotalWorkorderMonth({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryTotalWorkorderMonth, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryTotalWorkorderMonth', response);
        return response;
      },
      *queryBadWorkorderMonth({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryBadWorkorderMonth, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryBadWorkorderMonth', response);
        return response;
      },
      *queryBadWorkorder({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryBadWorkorder, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryBadWorkorder', response);
        return response;
      },
      *queryGoodWorkorderMonth({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryGoodWorkorderMonth, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryGoodWorkorderMonth', response);
        return response;
      },
      *queryPartitonRank({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryPartitonRank, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryPartitonRank', response);
        return response;
      },
      *queryTotalWorkorderYear({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryTotalWorkorderYear, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryTotalWorkorderYear', response);
        return response;
      },
      *queryBadWorkorderYear({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryBadWorkorderYear, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryBadWorkorderYear', response);
        return response;
      },
      *queryGoodWorkorderYear({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryGoodWorkorderYear, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryGoodWorkorderYear', response);
        return response;
      },
      *queryGoodWorkorder({ payload }, { call, put }) {
        console.log('payload', payload);
        const response = yield call(queryGoodWorkorder, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        console.log('queryGoodWorkorder', response);
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
    },
  };
  