/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.enrichers.runner;

import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RunnerFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@Features({AutomationFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy("org.nuxeo.binary.metadata")
@Deploy("org.nuxeo.ecm.platform.url.core")
@Deploy("org.nuxeo.ecm.platform.types.api")
@Deploy("org.nuxeo.ecm.platform.types.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.enrichers.operations.xml")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.pageproviders.xml")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml")
@Deploy("FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml")
@Deploy("FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml")
@Deploy("FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml")
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class FirstVoicesEnricherFeature implements RunnerFeature {

}