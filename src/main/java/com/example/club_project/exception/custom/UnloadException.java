package com.example.club_project.exception.custom;

/**
 * MultipartFile 업로드 시 발생할 수 있는 예외를 처리하기 위한 Exception
 */
public class UnloadException extends ClubRuntimeException {
    public UnloadException(String msg) {
        super(msg);
    }
}
