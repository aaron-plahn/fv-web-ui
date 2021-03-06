package ca.firstvoices.core.io.marshallers.tasks;

import static org.nuxeo.ecm.core.io.registry.MarshallingConstants.ENTITY_FIELD_NAME;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.core.io.marshallers.tasks.models.SimpleTaskAdapter;
import ca.firstvoices.core.io.models.SimpleCoreEntity;
import ca.firstvoices.core.io.models.SimplePrincipalEntity;
import ca.firstvoices.core.io.utils.StateUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.util.Calendar;
import java.util.Objects;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.ecm.core.schema.utils.DateParser;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/**
 * Will return a custom result for SimpleTask objects
 */
@Setup(mode = SINGLETON, priority = REFERENCE)
public class SimpleTaskWriter extends AbstractJsonWriter<SimpleTaskAdapter> {

  public static final String ENTITY_TYPE = "simple-task";

  @Override
  public void write(SimpleTaskAdapter task, JsonGenerator jg) throws IOException {
    jg.writeStartObject();

    // Entity type property
    jg.writeStringField(ENTITY_FIELD_NAME, ENTITY_TYPE);

    // Entity type property
    jg.writeStringField("uid", task.getId());

    // Enrich targetDocId to include more doc data
    String targetDocId = task.getTargetDocId();

    if (Objects.nonNull(targetDocId)) {
      try (CloseableCoreSession session = CoreInstance.openCoreSession(
          Framework.getService(RepositoryManager.class).getDefaultRepositoryName())) {

        IdRef targetDocRef = new IdRef(targetDocId);

        if (!session.exists(targetDocRef)) {
          // If target document does not exist, no need to proceed
          // This should not happen but could be a side-effect of old tasks
          jg.writeEndObject();
          return;
        }

        // `targetDoc` property
        DocumentModel targetDoc = session.getDocument(targetDocRef);
        SimpleCoreEntity simpleTargetDoc = new SimpleCoreEntity(targetDoc);
        jg.writeObjectField("targetDoc", simpleTargetDoc);

        // `dateCreated` property
        Calendar cal = task.getDateCreated();
        if (cal != null) {
          jg.writeStringField("dateCreated", DateParser.formatW3CDateTime(cal.getTime()));
        }

        // `requestedVisibility` property
        if (Objects.nonNull(task.getRequestedVisibility())) {
          String requestedVisibility = convertToVisibilityString(task.getRequestedVisibility());

          if (!"".equals(requestedVisibility)) {
            jg.writeStringField("requestedVisibility", requestedVisibility);

            boolean visibilityChanged = !targetDoc.getCurrentLifeCycleState()
                .equals(StateUtils.visibilityToState(requestedVisibility));
            jg.writeBooleanField("visibilityChanged", visibilityChanged);
          }
        }

        // `requestedBy` property
        UserManager um = Framework.getService(UserManager.class);
        NuxeoPrincipal user = um.getPrincipal(task.getRequestedBy());

        if (Objects.nonNull(user)) {
          jg.writeObjectField("requestedBy", new SimplePrincipalEntity(user));
        } else if (Objects.nonNull(task.getRequestedBy())) {
          jg.writeObjectField("requestedBy", new SimplePrincipalEntity(task.getRequestedBy()));
        }

        // comments on task
        jg.writeObjectField("comments", task.getTaskComments());
      }
    }

    jg.writeEndObject();
  }

  /**
   * Will convert legacy directives (e.g. "Approval to X required") to a visibility string. Can be
   * removed when no more old tasks exist.
   *
   * @param directive visibility string (new), or a sentence in the above format (legacy)
   * @return the correct visibility string for the task
   */
  private String convertToVisibilityString(String directive) {
    switch (directive) {
      case "Approval to Disable required":
      case "team":
        return "team";

      case "Approval to Enable required":
      case "Approval to Unpublish required":
      case "members":
        return "members";

      case "Approval to Publish required":
      case "public":
        return "public";

      default:
        return "";
    }
  }
}
