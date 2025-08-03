import { Button, Flex, Result } from "antd";
import React from "react";

class ErrorBoundary500 extends React.Component<{ children: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        console.log(error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        //   logErrorToMyService(error, errorInfo);
        console.log(error, errorInfo);
    }

    render() {
        if ((this.state as any).hasError) {
            // You can render any custom fallback UI
            return (
                <Flex align="center" justify="center" style={{ height: "100vh" }}>
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="Looks like something went wrong on our side."
                        extra={
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                    sessionStorage.clear();
                                    window.open("/", "_self")
                                }}
                            >
                                Back home
                            </Button>
                        }
                    />
                </Flex>
            );
        }

        return this.props.children;
    }
}
export default ErrorBoundary500;