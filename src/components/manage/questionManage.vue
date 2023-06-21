<template>
    <div>
        <div class="card mb-10">
            <div class="flex align-center float-right mt-5 mr-5">
                <n-button @click="openSearch" size="small" :type="(screen.keyword || screen.sid) ? 'info' : 'default'"
                    :strong="!(screen.keyword || screen.sid)" :secondary="!(screen.keyword || screen.sid)" circle
                    class="mr-5">
                    <template #icon>
                        <n-icon>
                            <SearchRound />
                        </n-icon>
                    </template>
                </n-button>
                <n-button @click="openForm()" size="small" type="primary" round>
                    <template #icon>
                        <n-icon>
                            <AddCircle24Regular />
                        </n-icon>
                    </template>
                    添加
                </n-button>
            </div>
            <div class="card-name">题目 <span class="text-gray">{{ number }}</span></div>
            <n-spin :show="loading">
                <n-scrollbar style="height: 300px">
                    <div class="question-item flex align-center justify-between" v-for="item in list"
                        @click="openForm(item)">
                        <div>
                            <div class="line1">{{ item.question }}</div>
                            <n-tag v-if="item.level == 1 || item.level == 2" :bordered="item.level == 1" size="small"
                                type="success">{{ item.level == 1 ? '极易' : '容易' }}</n-tag>
                            <n-tag v-else-if="item.level == 3" size="small" type="warning">一般</n-tag>
                            <n-tag v-else-if="item.level == 4 || item.level == 5" :bordered="item.level == 4" size="small"
                                type="error">{{ item.level == 4 ? '较难' : '极难' }}</n-tag>
                            <n-tag class="ml-5" :bordered="false" type="info" size="small">{{ type[item.type -
                                1].label }}</n-tag>
                            <n-text depth="3" class="ml-10">
                                <n-ellipsis style="max-width: 190px">#{{ item.subject }}</n-ellipsis>
                            </n-text>
                        </div>
                        <n-button @click.stop="remove(item.id)" strong secondary circle type="error">
                            <template #icon>
                                <n-icon>
                                    <DeleteForeverRound />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </n-scrollbar>
                <n-pagination v-if="number > 0" class="justify-center pa-5" :page-slot="7" v-model:page="page" :item-count="number" @update:page="getList" />
            </n-spin>
        </div>
        <question-search ref="search" :subjects="subjects" :type="type" @update="submitSearch" />
        <question-form ref="form" :subjects="subjects" :type="type" @update="update" />
    </div>
</template>
<script>
import { DeleteForeverRound, SearchRound } from '@vicons/material'
import { AddCircle24Regular } from '@vicons/fluent'
import QuestionSearch from '../modal/questionSearch.vue'
import QuestionForm from '../modal/questionForm.vue'
import { question } from '../../plugins/api'
export default {
    components: { QuestionSearch, QuestionForm, DeleteForeverRound, SearchRound, AddCircle24Regular },
    props: {
        subjects: {
            type: Array,
            default: []
        },
    },
    data: () => ({
        loading: true,
        list: [],
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
        page: 0,
        number: 0,
        screen: {
            keyword: '',
            sid: null
        }
    }),
    methods: {
        getNumber() {
            this.loading = true
            question.getNumber(this.screen.sid, this.screen.keyword).then(res => {
                this.number = res.num
                this.list = []
                if (res.num > 0) {
                    this.page = 1
                    this.getList()
                } else {
                    window.$message.warning('未找到可用试题')
                    this.loading = false
                }
            }).catch(() => {
                this.loading = false
            })
        },
        getList() {
            this.loading = true
            question.getList(this.screen.sid, this.screen.keyword, this.page, 10).then(res => {
                if (res.list) {
                    for (let i in res.list) {
                        res.list[i].subject = this.getSubject(res.list[i].sid)
                    }
                    setTimeout(() => {
                        this.list = res.list
                        this.loading = false
                    }, 500)
                } else {
                    window.$message.warning(res.message ? res.message : '发生意料之外的错误')
                    this.loading = false
                }
            }).catch(() => {
                this.loading = false
            })
        },
        getSubject(sid) {
            for (let i in this.subjects) {
                if (this.subjects[i].value == sid) return this.subjects[i].label
            }
            return '未知科目'
        },
        openForm(item) {
            if (item) this.$refs.form.edit(item)
            else this.$refs.form.add()
        },
        openSearch() {
            this.$refs.search.open(this.screen)
        },
        submitSearch(screen) {
            console.log(screen)
            this.screen = screen
            this.getNumber()
        },
        update(type) {
            if (type === 'add') this.getNumber();
            else this.getList();
        },
        remove(id) {
            window.$dialog.warning({
                title: '操作确认',
                content: '确认要删除此题?',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                    question.remove(id).then(res => {
                        if (res.state) {
                            window.$message.success('删除成功')
                            this.getList()
                        } else window.$message.warning(res.message ? res.message : '删除失败')
                    }).catch(() => {
                        this.form.loading = false
                    })
                }
            })
        },
    },
    mounted() {
        setTimeout(() => {
            this.getNumber()
        }, 500);
    }
};
</script>
<style scoped>
.question-list {
    height: 300px;
}

.form-ops {
    min-height: 34px;
}

.form-ops-index {
    width: 24px;
}

.question-item {
    border-top: #556276 1px solid;
    cursor: pointer;
    padding: 10px;
}

.question-item:hover {
    background-color: #45546a;
}
</style>