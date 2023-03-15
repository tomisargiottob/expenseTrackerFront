import { Col, Row, Select, DatePicker, Form } from "antd"
import {CloseOutlined} from "@ant-design/icons";

function TableFilters({
    setShowFilters, 
    applyFilters,
    accountsData,
    categoriesData,
    accountTypesData,
    filterValues,
}) {
    console.log(filterValues)
    return (
      <div className="filter-container">
        <Row className="filter-header">
          <Col>
            <CloseOutlined 
              onClick={() => setShowFilters(false)}
              size={30}
            />
          </Col>
        </Row>
        <Form 
          className="filter-section"
          initialValues={filterValues}
          onFinish={applyFilters}
        > 
          <Row className="row-form">
            <Col span={24}>
              <Form.Item name='frequency' className="form-item-filter" label='Select Frequency'>
                <Select>
                  <Select.Option value="7">Last 1 Week</Select.Option>
                  <Select.Option value="30">Last 1 Month</Select.Option>
                  <Select.Option value="365">Last 1 Year</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
              </Form.Item>

              {filterValues.frequency === "custom" && (
                <div className="mt-2">
                  <DatePicker
                    name='selectedRange'
                  />
                </div>
              )}
            </Col>

            <Col span={24}>
              <Form.Item name='type' className="form-item-filter" label='Select Type'>
                <Select>
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='account' className="form-item-filter" label='Select account'>
                <Select 
                  showSearch={true} 
                  placeholder='Select account'
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                  <Select.Option value="all">All</Select.Option>
                  {accountsData.map((account) => {
                    return (<Select.Option key={account._id} value={account._id}>{account.name}</Select.Option>)             
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='accountType' className="form-item-filter" label='Select account type'>
                <Select 
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Search Account Type">
                  <Select.Option value="all">All</Select.Option>
                  {accountTypesData.map((account) => {
                    return (<Select.Option key={account._id} value={account._id}>{account.name}</Select.Option>)             
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='category' className="form-item-filter" label='Select category'>
                <Select
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder='Select category type'
                >
                <Select.Option value="all">All</Select.Option>
                  {categoriesData.map((category) => {
                    return (<Select.Option title={category.description} key={category._id} value={category._id}>{category.name}</Select.Option>)             
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <button className="primary" type="submit">
              Apply
            </button>
          </div>
        </Form>
      </div>
    )
}

export default TableFilters