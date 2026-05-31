import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
    Button, Upload, Modal, message,
    Form, Input, Select, UploadProps,
    //Table,
    Space,
    GetProp,
    TableProps,
} from 'antd';
import * as ExcelJS from 'exceljs';
import { useEffect, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, InboxOutlined } from '@ant-design/icons';
export type TableListItem = {
    key: number;
    name: string;
    studentID: string;
    class_name: string;
};

const { Dragger } = Upload;
import { deceteMobile } from '../../../global.ts';
import Skeleton1 from '../../../Module/Skeleton.tsx';
import { PasswordHash } from '../../../Module/PasswordCrypto.ts';
import { formItemLayout } from '../dashboard.tsx';
import messageService from '../../../Module/messageService.ts';
import { memberApiService } from '../../../Api/memberList.ts';
import { FilterValue, SorterResult } from 'antd/lib/table/interface.js';


interface ClassList {
    value: string,
    label: string
}

var searchDataSource: TableListItem[] = [];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}


const previewColumns = [

    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
    },
    {
        title: '班级',
        dataIndex: 'class_name',
        key: 'class_name',
    },
    {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
    },
];

let queryWord: string = "";

const MemberList: React.FC = () => {

    const [dataSource, setDataSource] = useState<TableListItem[]>([]);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);


    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);

    const [confirmLoading1, setConfirmLoading1] = useState(false);
    const [confirmLoading2, setConfirmLoading2] = useState(false);
    const [confirmLoading3, setConfirmLoading3] = useState(false);

    //const [modalText, setModalText] = useState('Content of the modal');
    const [classList, setClassList] = useState<null | ClassList[]>(null);
    const [defaultClassList, setDefaultClassList] = useState();

    const [deleteStudentId, setDeleteStudentId] = useState("");
    const [deleteStudentName, setDeleteStudentName] = useState("");
    const [showDeleteStudent, setShowDeleteStudent] = useState(false);
    const [showDeleteStudentList, setShowDeleteStudentList] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // const [refreshKey, setRefreshKey] = useState(230);

    const [uploadKey, setUploadKey] = useState(0);
    const [xlxsAnalysisData, setXlxsAnalysisData] = useState<null | DataType[]>(null);
    const [previewData, setPreviewData] = useState<null | DataType[]>(null);



    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [ClassListForm] = Form.useForm();

    const [isMobile, _setIsMobile] = useState(deceteMobile());

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 20
        },
    });



    // 列表结构

    const columns: ProColumns<TableListItem>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (_) => <a>{_}</a>,
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: '学号',
            dataIndex: 'studentID',
            key: 'studentID',
            //align: 'right',
            //sorter: (a, b) => Number(a.studentID) - Number(b.studentID),
        },
        {
            title: '班级',
            key: 'class_name',
            dataIndex: 'class_name',
            hidden: isMobile
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            render: (_, entity) => [
                <a style={{ whiteSpace: "nowrap" }} onClick={() => student_edit(entity.studentID, entity.name, entity.class_name)} key="editInfo">编辑信息</a>,
                <a style={{ whiteSpace: "nowrap" }} onClick={() => student_password_edit(entity.studentID, entity.name)} key="editPasswd">修改密码</a>,
                <a style={{ whiteSpace: "nowrap" }} onClick={() => student_delete(entity.studentID, entity.name)} key="deleteStu">删除</a>,
            ],
        },
    ];

    const props: UploadProps = {
        progress: {
            showInfo: false,
            trailColor: "#108ee9",
            strokeWidth: 3,
            format: () => `${parseFloat('100')}%`,
        },
    };

    interface DataType {
        name: string,
        account: string,
        class_name: string,
        password: string
    };

    interface BatchAddPayloadItem {
        name: string,
        account: string,
        class_id: string,
        password: string
    };

    function xlxsAnalysis(file: any) {

        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            message.error('只能上传.xlsx文件');
            return;
        }

        const workbook = new ExcelJS.Workbook();

        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            workbook.xlsx.load(arrayBuffer)
                .then(() => {
                    const worksheet = workbook.getWorksheet('Sheet1');
                    var columnsData: Array<DataType> = [];
                    var columnsShowData: Array<DataType> = [];

                    const columnNames = ['姓名', '学号', '班级', '密码'];
                    if (!worksheet) {
                        messageService.info("解析失败!");
                        throw new DOMException("找不到Sheet1");
                    }
                    // 按行遍历 读取指定名称四列的内容，并存入数组中

                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) {
                            // 检查第一行的列名称是否匹配
                            var i = 0;
                            row.eachCell((cell) => {
                                if (columnNames.includes(cell.text)) {
                                    i++;
                                }
                            });

                            if (i < 4) {
                                messageService.info("列名不匹配！ 请检查xlxs文件中是否含有'姓名', '学号', '班级', '密码'等四列");
                                //setOpen2(false);
                                throw new DOMException();
                            }
                        } else {
                            // 从第二行开始读取数据
                            var rowData: DataType = {
                                name: '',
                                account: '',
                                class_name: '',
                                password: ''
                            };
                            row.eachCell((cell, colNumber) => {
                                const columnName = worksheet.getCell(1, colNumber).text;
                                if (!columnNames.includes(columnName)) return;
                                var texts: string = cell.text;
                                texts = texts.split('\\').join('');
                                texts = texts.split('\n').join('');
                                texts = texts.split('\r').join('');
                                texts = texts.split('\t').join('');

                                if (columnName == columnNames[0]) rowData['name'] = texts;
                                if (columnName == columnNames[1]) rowData['account'] = texts;
                                if (columnName == columnNames[2]) rowData['class_name'] = texts;
                                if (columnName == columnNames[3]) rowData['password'] = texts;
                                //if (columnName == columnNames[3]) rowData['password'] = cell.text.slice(-6);
                            });
                            columnsShowData.push(JSON.parse(JSON.stringify(rowData)));
                            rowData['password'] = PasswordHash(rowData['password']);
                            columnsData.push(rowData);
                        }
                    });
                    setXlxsAnalysisData(columnsData);
                    messageService.info('解析成功! ');
                    analysisPreview(columnsShowData);
                })
                .catch((error) => {
                    setXlxsAnalysisData(null);
                    messageService.info('解析失败! ' + error);
                    //setOpen2(false);
                });

        };
        //setOpen2(false);
        reader.readAsArrayBuffer(file);

    }

    function analysisPreview(columnsShowData: Array<DataType>) {
        //规范化显示
        //messageService.info(JSON.stringify(columnsShowData));   
        setPreviewData(columnsShowData);
        setOpen5(true);
    }

    async function showModal1() {
        // 向后端请求列表并填充进Select中
        form1.resetFields();
        await get_class_list()
        setOpen1(true);
    };

    function showModal2() {
        setUploadKey(uploadKey + 1);
        setOpen2(true);
    };


    async function TableClassSet() {
        //setLoading(true);
        await getMaxStudent();
        await get_student_list(0);
        //setLoading(false);
    }

    // 提交学生删除
    async function student_delete_submit() {
        try {
            const arr: Array<string> = [deleteStudentId];
            await memberApiService.deleteStudent(arr);
            messageService.info('删除成功!');
            setLoading(true);
            await getMaxStudent();
            await get_student_list(0);
            setLoading(false);
        } catch (error: any) {
            messageService.error('删除失败: ' + error.message);
        }

        setShowDeleteStudent(false);
    }

    // 提交学生批量删除
    async function student_list_delete_submit() {
        try {
            await memberApiService.deleteStudent(selectedRowKeys as string[]);
            messageService.info('删除成功!');
            setLoading(true);
            await getMaxStudent();
            await get_student_list(0);
            setLoading(false);

        } catch (error: any) {
            messageService.error('删除失败: ' + error.message);
        }

        setShowDeleteStudentList(false);
        setSelectedRowKeys([]);
    }

    // 获取班级列表
    async function get_class_list() {
        try {
            const data = await memberApiService.getClassList();
            const parsedData = data.data;
            const transformedData = parsedData.map((item: any) => ({
                value: item.class_id,
                label: item.class_name
            }));


            setClassList(transformedData);

            if (transformedData.length > 0) {
                const result = transformedData[0]['value'];
                setDefaultClassList(result);

                ClassListForm.setFieldsValue({
                    class_id: result
                });
            }

        } catch (error) {
            setError(true);
        }
    }

    // 提交学生添加
    async function formSubmit1(values: any) {
        setConfirmLoading1(true);

        try {
            const param = [{
                name: values.name,
                account: values.account,
                password: PasswordHash(values.password),
                class_id: values.class_id
            }];

            await memberApiService.addStudent(param);

            messageService.info('提交成功!');
            setLoading(true);
            await getMaxStudent();
            await get_student_list(0);
            setLoading(false);

        } catch (error) {
            setError(true);
        } finally {
            setConfirmLoading1(false);
            setOpen1(false);
        }
    }




    // 提交编辑后的学生信息
    async function formSubmit2(values: any) {
        setConfirmLoading2(true);

        try {
            await memberApiService.editStudent(
                values.account,
                values.name,
                values.class_id
            );

            messageService.info('学生信息修改成功!');
            setLoading(true);
            await getMaxStudent();
            await get_student_list(0);
            setLoading(false);

        } catch (error: any) {
            messageService.error('学生信息修改失败: ' + error.message);
        } finally {
            setOpen3(false);
            setConfirmLoading2(false);
        }
    }

    async function refreshForm1() {
        try {
            await getMaxStudent();
            await get_student_list(0);
            messageService.success('刷新成功');
        } catch (error) {
            messageService.error('刷新失败');
        }
    }

    // 提交密码修改
    async function formSubmit3(values: any) {
        setConfirmLoading3(true);

        try {
            await memberApiService.changePassword(
                values.account,
                PasswordHash(values.password)
            );

            messageService.info('密码修改成功!');

        } catch (error: any) {
            messageService.error('密码修改失败: ' + error.message);
        } finally {
            setOpen4(false);
            setConfirmLoading3(false);
        }
    }

    // 提交表单解析数据
    async function addListSumbit() {
        if (xlxsAnalysisData == null || xlxsAnalysisData.length < 1) {
            messageService.info('No valid rows to submit');
            return;
        }

        try {
            const classNameSet = Array.from(new Set(xlxsAnalysisData.map((item) => item.class_name?.trim()).filter(Boolean)));
            const classNameToIdMap = new Map<string, string>();

            for (const className of classNameSet) {
                const classData = await memberApiService.getClassIdByName(className);
                classNameToIdMap.set(className, classData.data.class_id);
            }

            const payload: BatchAddPayloadItem[] = xlxsAnalysisData.map((item) => {
                const className = item.class_name?.trim();
                const classId = classNameToIdMap.get(className);

                if (!classId) {
                    throw new Error(`Class not found or unauthorized: ${className}`);
                }

                return {
                    name: item.name,
                    account: item.account,
                    class_id: classId,
                    password: item.password
                };
            });

            const data = await memberApiService.batchAddStudents(payload);

            if (data.code == 0) {
                messageService.info('Submit success!');
            } else if (data.code == 2) {
                messageService.error('Class not found or no permission');
            }
            setLoading(true);
            await getMaxStudent();
            await get_student_list(0);
            setLoading(false);
        } catch (error: any) {
            messageService.error(error?.message || 'Submit failed!');
            setError(true);
        }

        setOpen2(false);
        setXlxsAnalysisData(null);
    }



    // edit student
    const student_edit = (studentID: any, name: any, class_name: any) => {
        // 将学生信息填入表单
        var this_class = classList!.find((item) => item.label === class_name);
        form2.setFieldsValue({
            account: studentID,
            name: name,
            class_id: this_class?.value,
        });
        setOpen3(true);

    }


    // 删除学生
    const student_delete = (studentID: any, name: any) => {
        setDeleteStudentId(studentID);
        setDeleteStudentName(name);
        setShowDeleteStudent(true);
    }


    // 编辑学生密码
    const student_password_edit = (studentID: any, name: any) => {
        form3.resetFields();
        form3.setFieldsValue({
            account: studentID,
            name: name,
        });
        setOpen4(true);
    }


    // 获取活动总数并进行表格数组填充初始化
    async function getMaxStudent() {
        try {
            const class_id = ClassListForm.getFieldValue('class_id');

            const response = await memberApiService.getStudentCount(class_id, queryWord);

            const count = Number(response.data);
            if (isNaN(count)) return;

            // 更新分页参数
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: count,
                    current: 1,
                    showSizeChanger: false,
                    showQuickJumper: true
                },
            });

            // 初始化表格数据
            const tableData: TableListItem[] = Array.from({ length: count }, () => ({
                key: Math.random(),
                class_name: "",
                name: "",
                studentID: "",
            }));

            setDataSource(tableData.slice());
            searchDataSource = tableData.slice();

        } catch (error: any) {
            messageService.error(error?.message || '获取学生数据失败');
        }
    }

    // 处理缓存部分 防止重复加载
    const handleTableChange: TableProps<TableListItem>['onChange'] = async (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<TableListItem> | SorterResult<TableListItem>[],) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        //if (!(Number(dataSource[(pagination.current! - 1) * 20].studentID) >= 1)) {      // 通过取值判断当前页是否有数据，没有则请求
        await get_student_list((pagination.current! - 1) * 20);
        //}
    }

    async function get_student_list(query_count: number) {
        try {
            const class_id = ClassListForm.getFieldValue('class_id');
            const data = await memberApiService.getStudentList(class_id, query_count, queryWord);

            if (data.code == 1) {
                setDataSource([]);
            } else {
                const parsedData = data.data;
                const tableData: TableListItem[] = parsedData.map((item: any) => ({
                    key: item.account,
                    name: item.name,
                    studentID: item.account,
                    class_name: item.class_name,
                }));

                const dataLength = tableData.length;
                const tempData: TableListItem[] = [...searchDataSource];

                for (let i = 0; i < dataLength; i++) {
                    tempData[i + query_count] = tableData[i];
                }

                setDataSource([...tempData]);
                searchDataSource = [...tempData];
            }
        } catch (error) {
            setError(true);
        }
    }

    useEffect(() => {
        setTimeout(async () => {
            queryWord = "";
            await get_class_list();
            await getMaxStudent();
            await get_student_list(0);
        }, 0);
        setLoading(false);
    }, []);


    return (
        <>

            {loading && <Skeleton1 />}


            {!error && !loading && (
                <ProTable<TableListItem>
                    columns={columns}
                    dataSource={dataSource}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    options={{
                        reload: ((_e: React.MouseEvent<HTMLSpanElement>, _action?: ActionType) => refreshForm1())
                    }}
                    rowSelection={{
                        selectedRowKeys,
                        //selections: [Table.SELECTION_ALL],
                        onSelect: (record, selected) => {
                            let arr = []
                            if (selected) {
                                arr = Array.from(new Set([...selectedRowKeys, record.key]))
                            } else {
                                arr = selectedRowKeys.filter(item => {
                                    return item !== record.key
                                })
                            }
                            setSelectedRowKeys(arr)
                        },
                        onChange: (selectedRowKeys) => {
                            setSelectedRowKeys(selectedRowKeys)
                        }
                    }}
                    tableAlertOptionRender={({ selectedRowKeys }) => {
                        return (
                            <Space size={16}>
                                <a onClick={() => { setSelectedRowKeys(selectedRowKeys); setShowDeleteStudentList(true); }}>批量删除</a>
                            </Space>
                        );
                    }}
                    toolbar={{
                        title: [
                            <div key="class-select-form">
                                <Form
                                    id="ClassListForm"
                                    form={ClassListForm}
                                    size={"middle"}
                                    style={{ height: "32px" }}
                                >
                                    <Form.Item
                                        name="class_id"
                                        initialValue={defaultClassList}
                                    >
                                        <Select
                                            placeholder="请选择班级"
                                            options={classList!}
                                            onChange={TableClassSet}
                                            showSearch
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                        ],
                        filter: [
                            // 如果有多个过滤器元素，每个都需要 key
                        ],
                        search: {
                            onSearch: (value: string) => {
                                queryWord = value;
                                getMaxStudent();
                                get_student_list(0);
                            },
                            placeholder: "请输入学生名称"
                        },
                        actions: [
                            <Button
                                key="add"
                                type="primary"
                                onClick={() => { showModal1() }}
                            >
                                添加学生
                            </Button>,
                            <Button
                                key="addList"
                                type="primary"
                                onClick={() => { showModal2() }}
                            >
                                批量添加
                            </Button>,
                        ],
                    }}
                    rowKey="key"
                    search={false}
                />
            )}

            <Modal
                title="添加学生"
                open={open1}
                onOk={() => { form1.submit() }}
                confirmLoading={confirmLoading1}
                onCancel={() => { setOpen1(false) }}
            >

                <Form {...formItemLayout} form={form1} onFinish={formSubmit1} style={{ maxWidth: 600 }}>
                    <Form.Item label="学号（账号）" name="account" rules={[{ required: true, message: '请输入学号（账号）' },
                    {
                        message: '请勿输入特殊字符',
                        pattern: /^((?!\+|\.|\\|\/|:|\*|\?|<|>|\|| |'|%|@|#|&|\$|\^|&|\*).){1,20}$/
                    }]}>
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' },
                    {
                        message: '请勿输入特殊字符',
                        pattern: /^((?!\+|\.|\\|\/|:|\*|\?|<|>|\|| |'|%|@|#|&|\$|\^|&|\*).){1,10}$/
                    }]}>
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label="初始密码" name="password" rules={[{ required: true, message: '请输入初始密码' }]}>
                        <Input.Password maxLength={40} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </Form.Item>
                    <Form.Item label="重复输入密码" name="password_verify" rules={[
                        { required: true, message: '请输入相同的密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject("两次密码输入不一致")
                            }
                        })
                    ]}
                        validateTrigger="onBlur"
                    >
                        <Input.Password maxLength={40} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </Form.Item>

                    <Form.Item label="班级" name="class_id" rules={[{ required: true, message: '请选择班级' }]}>
                        <Select showSearch={{optionFilterProp: ['label']}} options={classList!} />
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                title="批量添加"
                open={open2}
                confirmLoading={false}
                onCancel={() => { setOpen2(false); setXlxsAnalysisData(null); }}
                onOk={addListSumbit}
            >
                <div key={uploadKey}>
                    <Dragger {...props} onChange={({ file }) => { xlxsAnalysis(file) }} accept=".xlsx" onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                        beforeUpload={() => false}
                        maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽.xlxs文件到此处</p>
                        <p className="ant-upload-hint">
                            请将xlxs文件拖入网页，网页会自动识别excel文件中
                            “姓名”，“学号”，“班级”，“密码”等列的内容并自动填充。
                        </p>
                    </Dragger>
                </div>
            </Modal>



            <Modal
                title="编辑信息"
                open={open3}
                onOk={() => { form2.submit() }}
                confirmLoading={confirmLoading2}
                onCancel={() => { setOpen3(false) }}
            >

                <Form {...formItemLayout} form={form2} onFinish={formSubmit2} style={{ maxWidth: 600 }} >
                    <Form.Item label="学号（账号）" name="account" rules={[{ required: true, message: '请输入学号（账号）' }]}>
                        <Input maxLength={20} disabled />
                    </Form.Item>
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label="班级" name="class_id" rules={[{ required: true, message: '请选择班级' }]}>
                        <Select options={classList!} />
                    </Form.Item>
                </Form>
            </Modal>



            <Modal
                title="修改密码"
                open={open4}
                onOk={() => { form3.submit() }}
                confirmLoading={confirmLoading3}
                onCancel={() => { setOpen4(false) }}
            >
                <Form {...formItemLayout} form={form3} onFinish={formSubmit3} style={{ maxWidth: 600 }} >
                    <Form.Item label="学号（账号）" name="account">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="姓名" name="name">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="新密码" name="password" rules={[{ required: true, message: '请输入新密码' }]}>
                        <Input.Password maxLength={40} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </Form.Item>
                    <Form.Item label="重复输入密码" name="password_verify" rules={[
                        { required: true, message: '请输入相同的密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject("两次密码输入不一致")
                            }
                        })
                    ]}
                        validateTrigger="onBlur"
                    >
                        <Input.Password maxLength={40} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </Form.Item>
                </Form>
            </Modal>



            <Modal title="信息预览" open={open5} onOk={() => { setOpen5(false); }} onCancel={() => { setOpen5(false); }} cancelButtonProps={{ style: { display: 'none' } }} style={{ maxHeight: '70vh', overflow: 'auto', scrollbarWidth: 'none', overflowY: "hidden" }} destroyOnHidden>

                <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    {previewData && <ProTable dataSource={previewData!} columns={previewColumns} options={false} search={false} />}
                </div>
            </Modal>


            <Modal title="删除学生" open={showDeleteStudent} onOk={() => { student_delete_submit() }} onCancel={() => { setShowDeleteStudent(false) }} destroyOnHidden okType="danger" okText="确定">
                <p>您确定要删除学生<b>{deleteStudentName}</b>吗？</p>
            </Modal>


            <Modal title="删除选中的学生" open={showDeleteStudentList} onOk={() => { student_list_delete_submit() }} onCancel={() => { setShowDeleteStudentList(false) }} destroyOnHidden okType="danger" okText="确定">
                <p>您确定要删除所有选中的学生吗？</p>
            </Modal>


        </>
    );
};

export default MemberList;
