import { ClearOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Result, Segmented, Space } from "antd";
import { AntxBubbleList, AntxSender } from "~/module/module.antx";
import { TTabId } from "./data.tab";
import { hocViewChatModal } from "./store";

const ViewChatModal = hocViewChatModal(({ store }) => {
    return <Modal
        style={{ top: 20 }}
        footer={null}
        width={{ xs: '98%', sm: '90%', md: '80%', lg: '75%', xl: '70%', xxl: '60%' }}
        onCancel={() => store.setModal(false)}
        open={store.isModalOpen}
    >
        <Flex gap={"small"} vertical>
            <Flex style={{ marginRight: 24 }}
                gap={"small"}
                align="center" justify="space-between"
            >
                <Flex gap={"small"} align="center">
                    <img style={{ width: 24 }} src="/bot.png" alt="AI" />
                    <span>Ask AI about <strong>{store.aiSystemPrompt.pageTitle}</strong> displayed data</span>
                </Flex>
                <Space>
                    {store.chatMessages.length > 0 &&
                        <Button onClick={() => store.onClearChat()} icon={<ClearOutlined />}>
                            Clear chats
                        </Button>
                    }
                    <Segmented<TTabId>
                        value={store.tab}
                        options={["chat", "data"]}
                        onChange={(value) => store.onSetTab(value)}
                    />
                </Space>
            </Flex>
            {store.tab == "data" && <pre style={{ whiteSpace: "pre-wrap" }}>{store.aiSystemPrompt.forDisplay}</pre>}
            {store.tab == "chat" &&
                <Flex justify="space-between" vertical gap={"small"}>
                    <AntxBubbleList
                        style={{
                            marginBottom: 10,
                            minHeight: 600,
                            maxHeight: "calc(100vh - 180px)"
                        }}
                        items={store.chatMessages.length == 0 ? [{
                            variant: "borderless",
                            style: { margin: "0px auto" },
                            content: <Result
                                status={"404"}
                                extra={<>No conversations yet.
                                    <br />Please ask questions related to the data, such as
                                    <br /><Space>
                                        <Button onClick={() => store.askMessage("Provide insight")}>Provide insight</Button>
                                        <Button onClick={() => store.askMessage("Berikan wawasan")}>in indonesian</Button>
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
                                        borderRadius: 16,
                                    },
                                },
                                avatar: {
                                    src: "/bot.png"
                                },
                                variant: 'borderless',
                                messageRender: (content) =>
                                    <div className='bubble-aix' dangerouslySetInnerHTML={{ __html: content }} />

                            },
                            local: {
                                placement: 'end',
                            },
                        }}
                    />
                    <AntxSender
                        placeholder="Type something"
                        value={store.message}
                        onSubmit={() => store.onSubmitSender()}
                        onChange={(value) => store.onChangeSender(value)}
                        loading={store.isAskLoading}
                    />
                </Flex>
            }
        </Flex>
    </Modal>
});

export default ViewChatModal;
