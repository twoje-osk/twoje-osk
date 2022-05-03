import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import { Form, Input, Button, Checkbox } from 'antd';
import { Container } from './Login.styled';

export function Login() {
  const isLoginAuthResponse = (data: any): data is LoginAuthResponseDto => {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(data, 'accessToken');
  };

  const login = async (requestBody: any): Promise<string> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const body = (await response.json()) as unknown;

    if (!isLoginAuthResponse(body)) {
      throw Error('Login failed');
    }

    return body.accessToken;
  };

  const onSubmit = async (data: LoginAuthRequestDto) => {
    const requestBody = {
      email: data.email,
      password: data.password,
    };
    const authKey = await login(requestBody);
    console.log(authKey);
  };

  return (
    <Container>
      <Form
        name="login"
        labelCol={{ offset: 0, span: 8 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        style={{ width: '35%' }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
          wrapperCol={{ span: 22 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your username!' }]}
          wrapperCol={{ span: 22 }}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
