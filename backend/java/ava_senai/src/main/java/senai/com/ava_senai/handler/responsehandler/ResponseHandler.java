package senai.com.ava_senai.handler.responsehandler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;

@ControllerAdvice
public class ResponseHandler {

    @ExceptionHandler(Validation.class)
    public ResponseEntity<Object> handleValidation(Validation ex) {
        return new ResponseEntity<>(ex.getValidations(), HttpStatus.valueOf(400));
    }

    @ExceptionHandler(NullListException.class)
    public ResponseEntity<Object> handleNullListException(NullListException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.valueOf(404));
    }

}
