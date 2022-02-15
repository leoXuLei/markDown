import React, { useCallback, useState } from "react";
import { Modal } from "@com/sun";
import { YoutubeOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const InfoIcon = styled(YoutubeOutlined)`
  margin-left: 6px;
  font-size: 16px;
  vertical-align: sub;
  &:hover {
    color: #1b9aee;
  }
`;

export default function ProjectGroupGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [muted, setMuted] = useState(true);

  const showDialog = useCallback((isShow, isMuted = true) => {
    const $video = document.getElementById(
      "project-group-guide-video"
    ) as HTMLVideoElement;

    setShowGuide(isShow);
    setMuted(isMuted);

    if ($video) {
      if (isShow) {
        $video.currentTime = 0;
        $video.play();
      } else {
        $video.pause();
      }
    }
  }, []);

  return (
    <>
      <InfoIcon onClick={() => showDialog(true, false)} />
      <Modal
        centered
        visible={showGuide}
        onCancel={() => showDialog(false)}
        title="空间分组操作步骤"
        footer={null}
        width={1000}
      >
        <video
          id={"project-group-guide-video"}
          autoPlay
          muted={muted}
          loop={false}
          style={{ width: "100%" }}
          controls
          src=""
        />
      </Modal>
    </>
  );
}
