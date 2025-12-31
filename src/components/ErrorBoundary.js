import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="md" sx={{ mt: 10 }}>
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h4" gutterBottom color="error">
                            오류가 발생했습니다
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            페이지를 로드하는 중 문제가 발생했습니다. 아래 로그를 확인해 주세요.
                        </Typography>

                        <Box
                            sx={{
                                bgcolor: '#f5f5f5',
                                p: 2,
                                borderRadius: 1,
                                textAlign: 'left',
                                overflowX: 'auto',
                                mb: 3,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem'
                            }}
                        >
                            <strong>Error:</strong> {this.state.error?.toString()}
                            <br />
                            <br />
                            {this.state.errorInfo?.componentStack}
                        </Box>

                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                        >
                            페이지 새로고침
                        </Button>
                    </Paper>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
