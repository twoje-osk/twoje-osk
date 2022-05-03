import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useState } from 'react';
import { Container, ButtonContainer } from './Login.styled';

const { Title } = Typography;

export function Login() {
  const [isValid, setValidationState] = useState(true);

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

  const navigateToHome = () => {
    window.open('', '_self');
  };

  const resetInputs = () => {
    // document.querySelectorAll('Input').forEach((input) => {
    //   input.value = null;
    // });
  };

  const onSubmit = async (data: LoginAuthRequestDto) => {
    const requestBody = {
      email: data.email,
      password: data.password,
    };
    try {
      const authKey = await login(requestBody);
      if (authKey) {
        console.log(authKey);
        navigateToHome();
      }
    } catch {
      setValidationState(false);
      // message.error(
      //   'Błąd logowania. Upewnij się, że podajesz dobry email i hasło.',
      //   4,
      // );
      resetInputs();
    }
  };

  if (!isValid) {
    return (
      <Container>
        <Card style={{ width: '25%' }}>
          <Title>&lt;Nazwa Twojego OSK&gt;</Title>
          <Form
            name="login"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onSubmit}
            style={{ width: '80%', margin: 'auto' }}
          >
            <Alert
              message="Błąd logowania. Upewnij się, że podałeś poprawne login i hasło"
              type="error"
              showIcon
              closable
            />
            <br />
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Wpisz adres email' }]}
              wrapperCol={{ span: 22 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hasło"
              name="password"
              rules={[{ required: true, message: 'Wpisz hasło' }]}
              wrapperCol={{ span: 22 }}
            >
              <Input.Password />
            </Form.Item>
            <ButtonContainer>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Zaloguj się
                </Button>
              </Form.Item>
              <Form.Item>
                <Button htmlType="button">Zapisz się na kurs</Button>
              </Form.Item>
            </ButtonContainer>
          </Form>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card style={{ width: '25%' }}>
        <Title>&lt;Nazwa Twojego OSK&gt;</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onSubmit}
          style={{ width: '80%', margin: 'auto' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Wpisz adres email' }]}
            wrapperCol={{ span: 22 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Hasło"
            name="password"
            rules={[{ required: true, message: 'Wpisz hasło' }]}
            wrapperCol={{ span: 22 }}
          >
            <Input.Password />
          </Form.Item>
          <ButtonContainer>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Zaloguj się
              </Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType="button">Zapisz się na kurs</Button>
            </Form.Item>
          </ButtonContainer>
        </Form>
      </Card>
    </Container>
  );
}
