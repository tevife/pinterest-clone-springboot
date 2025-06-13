package hr.mlinx.pinterestclone.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank
    @Size(max = 39)
    private String username;

    @NotBlank
    @Size(max = 320)
    @Email
    private String email;

    @NotBlank
    @Size(max = 100)
    private String password;

}
