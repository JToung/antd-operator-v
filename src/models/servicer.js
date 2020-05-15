import { queryServicer , updateOperator , uplegalPersonPhoto} from '@/services/api';

export default {
  namespace: 'servicer',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *queryServicer({ payload }, { call, put }) {
      console.log('payload',payload);
      const response = yield call(queryServicer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response',response);
      return response
    },
    // *upOperator({ payload }, { call, put }) {
    //   console.log('payload1',payload);
    //   const response = yield call(updateOperator, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   console.log('response1',response);
    //   return response;
    // },
    // *uplegalPersonPhoto({ payload }, { call, put }) {
    //   console.log('saveIMG',payload);
    //   const response = yield call(uplegalPersonPhoto, payload);
    //   yield put({
    //     type: 'saveIMG',
    //     payload: response,
    //   });
    //   console.log('IMGresponse1',response);
    //   return response;
    // },
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
