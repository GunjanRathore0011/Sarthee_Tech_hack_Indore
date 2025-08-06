// src/ReduxSlice/form/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    additionDetail: {
        fullName: '',
        dob: '',
        gender: '',
        house: '',
        street: '',
        colony: '',
        state: 'Madhya Pradesh',
        district: '',
        policeStation: '',
        pincode: '',
        files: []

    },
    financialFraud: {
        formData: {
            category: 'Financial Fraud',
            subCategory: '',
            description: '',
            lost_money: 0,
            incident_datetime: '',
            reson_of_delay: '',
            delay_in_report: false,
            files: []
        },
        accData: {
            accountNumber: '',
            lost_money: '',
            bankName: '',
            ifscCode: '',
            transactionId: '',
            transactionDate: ''
        }
    },
    harassment: {
        category: 'Harassment',
        subCategory: '',
        incident_datetime: '',
        description: '',
        reson_of_delay: '',
        delay_in_report: false,
        files: []
    },
    otherCrime: {
        category: 'Other Crime',
        subCategory: '',
        incident_datetime: '',
        description: '',
        reson_of_delay: '',
        delay_in_report: false,
        files: []
    },
    suspectData: {
        suspectedName: '',
        suspectedCard: 'Other',
        suspectedFile: [],
        details: '',
        suspectedCardNumber: ''
    },
    categoryKey: {
        value: ''
    },
    next: {
        step: 1
    },
    userAdditionalDetailsField: {
        fill : 0,
    }
};

const formSlice = createSlice({
    name: 'formData',
    initialState,
    reducers: {
        setAdditionDetail: (state, action) => {
            state.additionDetail = action.payload;
        },
        setFinancialFraudForm: (state, action) => {
            state.financialFraud.formData = action.payload;
        },
        setFinancialFraudAcc: (state, action) => {
            state.financialFraud.accData = action.payload;
        },
        setHarassment: (state, action) => {
            state.harassment = action.payload;
        },
        setOtherCrime: (state, action) => {
            state.otherCrime = action.payload;
        },
        setSuspectData: (state, action) => {
            state.suspectData = action.payload;
        },
        setNextStep: (state, action) => {
            state.next.step = action.payload;
        },
        setCategoryKey: (state, action) => {
            state.categoryKey= action.payload;
        },
        setuserAdditionalDetailsField: (state, action) => {
            state.userAdditionalDetailsField = action.payload;
        },
      
        resetAllFormData: () => initialState,
    },
});

export const {
    setAdditionDetail,
    setFinancialFraudForm,
    setFinancialFraudAcc,
    setHarassment,
    setOtherCrime,
    setSuspectData,
    resetAllFormData,
    setNextStep,
    setCategoryKey,
    setuserAdditionalDetailsField
} = formSlice.actions;

export default formSlice.reducer;