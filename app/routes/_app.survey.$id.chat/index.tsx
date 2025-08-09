import { ClearOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Result, Space, theme } from "antd";
import { Observer } from 'mobx-react';
import { useEffect } from 'react';
import { AntxBubbleList, AntxSender, AntxWelcome } from "~/module/module.antx";
import ViewAppSurveyPage from '../_app.survey.$id/view.page-container';
import { hocSurveyIdChat } from "./store";
import { useResizeDetector } from 'react-resize-detector';

const avatarUrl = "/bot.png";
const SurveyIdChat = hocSurveyIdChat(({ store }) => {
    const { token } = theme.useToken();
    useEffect(() => {
        setTimeout(() => {
            store.scrollToBottom()
        }, 500)
    }, [store.chatMessages.length, store.isChatListReady])
    return <ViewAppSurveyPage
        className='chat3746a'
        title={<Flex gap={"small"}>
            <div>Ask your database</div>
            {store.chatMessages.length > 0 &&
                <Button onClick={() => store.onClearChat()} icon={<ClearOutlined />}>
                    Clear chats
                </Button>
            }
        </Flex>}
        extra={<AntxWelcome
            variant="borderless"
            icon={<Avatar src={avatarUrl} size={60} />}
            title="Greetings, I am your AI assistant."
            description="Transform Complex Surveys into Simple Answers"
        />}
    >
        <AntxBubbleList
            style={{
                marginBottom: 80,
            }}
            onLoad={() => store.onLoadChatList()}
            items={store.chatMessages.length == 0 ? [{
                variant: "borderless",
                style: { margin: "0px auto" },
                content: <Result
                    status={"404"}
                    extra={<>No conversations yet.
                        <br />Please ask questions related to the survey data, such as
                        <br /><Space>
                            <Button onClick={() => store.askMessage("Provide the available data columns with a short description")}>provide the available data columns</Button>
                            <Button onClick={() => store.askMessage("Berikan kolom data yang tersedia dengan deskripsi singkat")}>in indonesian</Button>
                        </Space>
                    </>
                    }
                />
            }] : store.chatMessages}

            roles={{
                ai: {
                    placement: 'start',
                    styles: {
                        content: {
                            backgroundColor: token.colorBgContainer,
                        },
                    },
                    avatar: {
                        src: avatarUrl
                    },
                    // variant: 'borderless',
                    messageRender: (content) =>
                        <div className='bubble-aix' dangerouslySetInnerHTML={{ __html: content }} />

                },
                local: {
                    placement: 'end',
                },
            }}
        />
        <Observer>{() => {
            const { ref, width } = useResizeDetector({ handleWidth: true });
            return <div ref={ref} style={{ width: "100%" }}>
                <AntxSender
                    style={{
                        backgroundColor: token.colorBgBase,
                        position: "fixed",
                        bottom: 20,
                        width: width,
                    }}
                    placeholder="Type something"
                    value={store.message}
                    onSubmit={() => store.onSubmitSender()}
                    onChange={(value) => store.onChangeSender(value)}
                    loading={store.isAskLoading}
                />
            </div>
        }}</Observer>

    </ViewAppSurveyPage>
});
export default SurveyIdChat;