package com.edusync.dto.response;

import java.util.List;

/** Notices grouped by lifecycle status for the notices page. */
public record NoticesPageResponse(
    List<NoticeResponse> published,
    List<NoticeResponse> drafts,
    List<NoticeResponse> archive
) {}
