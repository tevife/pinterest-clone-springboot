package hr.mlinx.pinterestclone.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank
    @Size(max = 100)
    private String oldPassword;

    @NotBlank
    @Size(max = 100)
    private String newPassword;

}
