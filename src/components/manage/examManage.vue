<template>
    <div>
        <div class="card mb-10">
            <n-button @click="openForm()" class="float-right mt-5 mr-5" size="small" type="primary" round>
                    <template #icon>
                        <n-icon>
                            <AddCircle24Regular />
                        </n-icon>
                    </template>
                    添加
                </n-button>
            <div class="card-name">考试</div>
            <div class="exam-list"></div>
        </div>
        <exam-form ref="form" :subjects="subjects" :type="type" @update="update" />
    </div>
</template>
<script>
import { DeleteForeverRound, CheckRound, SearchRound } from '@vicons/material'
import { AddCircle24Regular } from '@vicons/fluent'
import ExamForm from '../modal/examForm.vue'
import { exam } from '../../plugins/api'
export default {
    components: { ExamForm,DeleteForeverRound, CheckRound, SearchRound, AddCircle24Regular },
    props: {
        subjects: {
            type: Array,
            default: []
        },
    },
    data: () => ({
        loading: true,
        list: [],
        form: {
            show: false,
            loading: false,
        },
        type: [
            {
                label: "单选题",
                value: 1
            },
            {
                label: "多选题",
                value: 2
            },
            {
                label: "判断题",
                value: 3
            },
            {
                label: "填空题",
                value: 4
            },
            {
                label: "对号题",
                value: 5
            },
            {
                label: "简答题",
                value: 6
            },
            {
                label: "论述题",
                value: 7
            },
            {
                label: "作文题",
                value: 8
            }
        ],
    }),
    methods: {
        getList() {
            this.loading = true
        },
        openForm(item) {
            if (item) this.$refs.form.edit(item)
            else this.$refs.form.add()
        },
        update(){
            
        }
    },
    mounted() {
        setTimeout(() => {
            this.getList()
        }, 500);
    }
};
</script>
<style scoped>
.exam-list {
    height: 300px;
}
</style>